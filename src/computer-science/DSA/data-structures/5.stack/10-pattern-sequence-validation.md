# 10. Pattern: Sequence validation

## Table of contents

1. [Understanding the sequence validation pattern](#understanding-the-sequence-validation-pattern)
2. [Identifying the sequence validation pattern](#understanding-the-sequence-validation-pattern)
3. [Parentheses checker](#parentheses-checker)
4. [Minimum edits](#minimum-edits)
5. [Redundant parentheses](#redundant-parentheses)
6. [Balanced span](#balanced-span)

***

# Understanding the sequence validation pattern

There are some problems where we need to operate on interrelated data. An example of this could be a pair of events that denote the start and end of an interval. Another example could be opening and closing brackets that denote the start and end of a context. When dealing with a sequence of such events, a set of rules governs the validity of the sequence, which is generally defined by the problem. In most cases, to validate the sequence, we must move through the sequence, keeping track of several events and getting them in the order of most to least recent when needed.

// Diagram: A sequence of interrelated events.

The sequence validation technique uses the LIFO property of a stack to solve such problems by storing relevant events in the stack, which maintains the most to least recent order.

The sequence validation pattern is a classification of problems that can be solved using the sequence validation technique using a stack.

## The sequence validation technique

To understand the sequence validation technique, consider we are given a sequence of events `a, b, c, d, e`  where for any event `x`, `xs` denotes the the start of an event and `xe` denotes the end of an event. For a particular sequence of events to be valid, they need to adhere to the following rules 

1.  1For any closing event `xe`, the previous **unclosed** event can only be its opening event pair `xs`. The sequence `as bs be ae` is valid but the sequence `as bs ae be` is invalid. This is because in the second sequence, for the ending event `ae`, the previous start event is `bs` which is not its start pair.
2.  2The same type of events can also be nested infinitely i.e. `as as ae ae` is a valid sequence for an events.

Consider we are given the following sequence as an array `arr` that we need to validate.

// Diagram: A sequence of start and end events.

The sequence validation technique is quite intuitive. We create a stack `stack` to hold the opening events that have **not** yet been closed. We then traverse the array `arr`, and in each iteration, we check if the current event is an opening or closing event. If it is an opening event, we push it to the `stack` and move ahead. However, if it is a closing event, we get the previous unclosed event from the top of the stack. If the event at the top of the stack is the opening pair of the current event, we pop it from the stack and move ahead, otherwise we conclude that the sequence is invalid.

The traversal would only be complete if there was no failed check. However, this does not mean that the sequence is valid. If the sequence had more opening events than closing events, it would still be invalid. To verify this, we check the size of the stack in the end. If it is empty, it means the sequence is valid; otherwise, it is not.

// Diagram: Validate the sequence of start and end events

Now, let's consider another sequence that is invalid to see how the sequence validation technique identifies it as invalid.

// Diagram: Validate the sequence of start and end events

We explained the sequence validation technique using an arbitrarily defined set of rules which are generally defined by the problem. However, the same technique can be applied with slight modifications to validate a sequence with a different set of validation rules.

## Algorithm

The algorithm below outlines the generic sequence validation technique using a stack.

> **Algorithm**
>
> -   **Step 1:** Create an stack \`stack\` to hold the start events
> -   **Step 2:** Iterate in the sequence from start to end and in each iteration do the following:
>     -   **Step 2.1:** If the current event is a start event push it to the top of the \`stack\`.
>     -   **Step 2.2:** If the current event is an end event and do the following
>         -   **Step 2.2.2:** If the corresponding start event is **not** at the top of the stack, the sequence is invalid.
>     -   **Step 2.3:** Pop the item from the top of the \`stack\`
> -   **Step 3:** If the stack is empty, the sequence is valid otherwise not

## Implementation

Given below is the generic code implementation to validate a sequence of start and end events stored as strings using a stack.

C++

```cpp
bool validateSequence(vector<string> &arr)
{
    // Create a stack to store the start events
    stack<string> stack;

    // Iterate through each character in the string
    for (auto& event: arr ) {
        if (isStartEvent(event)) {
            // Push start event onto the stack
            stack.push(event);
        } else {
            // If the stack is empty or the ending event does
            // not pair with the previous start event
            // Return false as the sequence is invalid
            if (stack.empty() || !isMatchingPair(stack.top(), event)) {
                return false;
            }
            // Remove the corresponding start event from the stack
            stack.pop();
        }
    // If the stack is empty at the end, the sequence is valid
    return stack.empty();
}
```

Java

```java
public class SequenceValidator {

    public boolean validateSequence(List<String> arr) {
        // Create a stack to store the start events
        Stack<String> stack = new Stack<>();

        // Iterate through each event in the list
        for (String event : arr) {
            if (isStartEvent(event)) {
                // Push start event onto the stack
                stack.push(event);
            } else {
                // If the stack is empty or the ending event does
                // not pair with the previous start event
                // Return false as the sequence is invalid
                if (stack.isEmpty() || !isMatchingPair(stack.peek(), event)) {
                    return false;
                }
                // Remove the corresponding start event from the stack
                stack.pop();
            }
        // If the stack is empty at the end, the sequence is valid
        return stack.isEmpty();
    }
```

Typescript

```typescript
function validateSequence(arr: string[]): boolean {
  // Create a stack to store the start events
  const stack: string[] = [];

  // Iterate through each event in the array
  for (const event of arr) {
    if (isStartEvent(event)) {
      // Push start event onto the stack
      stack.push(event);
    } else {
      // If the stack is empty or the ending event does
      // not pair with the previous start event
      // Return false as the sequence is invalid
      if (stack.length === 0 || !isMatchingPair(stack[stack.length - 1], event)) {
        return false;
      }
      // Remove the corresponding start event from the stack
      stack.pop();
    }
  // If the stack is empty at the end, the sequence is valid
  return stack.length === 0;
}
```

Javascript

```javascript
function validateSequence(arr) {
  // Create a stack to store the start events
  const stack = [];

  // Iterate through each event in the array
  for (const event of arr) {
    if (isStartEvent(event)) {
      // Push start event onto the stack
      stack.push(event);
    } else {
      // If the stack is empty or the ending event does
      // not pair with the previous start event
      // Return false as the sequence is invalid
      if (stack.length === 0 || !isMatchingPair(stack[stack.length - 1], event)) {
        return false;
      }
      // Remove the corresponding start event from the stack
      stack.pop();
    }
  // If the stack is empty at the end, the sequence is valid
  return stack.length === 0;
}
```

Python

```python
def validate_sequence(arr: List[str]) -> bool:
    # Create a stack to store the start events
    stack = list[str]

    # Iterate through each event in the list
    for event in arr:
        if is_start_event(event):
            # Push start event onto the stack
            stack.append(event)
        else:
            # If the stack is empty or the ending event does not pair
            # with the previous start event, return False as the sequence is invalid
            if not stack or not is_matching_pair(stack[-1], event):
                return False
            # Remove the corresponding start event from the stack
            stack.pop()

    # If the stack is empty at the end, the sequence is valid
    return not stack
```

## Complexity Analysis

The algorithm's time and space complexity is easy to understand. We traverse the sequence from start to end once in any case, and in each iteration, either push the current item to the stack or pop an item from the stack. Since we only push start events in the stack, in the worst case, if the sequence only has start events, the runtime complexity will be linear **O(N)** as we will push all items in the sequence onto the stack. In the best case, all items will be end events, and we will declare the sequence invalid after reading the first item, leading to a constant **O(1)** runtime complexity.

We create a stack to hold the start events, and in the worst case, if the sequence only has start events, the stack will have all events of the sequence, leading to a linear **O(N)** space complexity. In the best case, all events will be end events and no item will be pushed to the stack leading to a constant **O(1)** space complexity.

> **Best Case -** All end events
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case -** All start events
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

Later in the course, we will examine techniques for identifying problems that can be solved using the sequence validation technique and walk through an example to better understand it.

***

# Identify the sequence validation pattern

The sequence validation technique we learned earlier can only solve some specific types of problems. These are generally easy or medium problems where we are given a sequence of start and end events and certain rules governing what constitutes a valid sequence. It is very difficult to solve such problems without using the sequence validation technique, as we need to keep multiple events in the most to least recent order.

If the problem statement or its solution follows the generic template below, it can be solved by applying the sequence validation technique.

**Template:**Given a sequence of start and end events and a set of rules defining validity, determine if the sequence is valid or not.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the sequence validation technique.

> **Problem statement:** Given a string \`s\` containing the only brackets, i.e., characters \`(\`, \`{\`, \`\[\`, \`)\`,\`}\` and \`\]\`. Determine if it is a valid bracket expression.

// Diagram: Validate the sequence of brackets

## The sequence validation technique

The problem description fits the template for the sequence validation pattern, as given below.

**Template:**Given a sequence (string `s`) of start and end events (opening and closing brackets) and a set of rules defining validity (mathematical grammer), determine if the sequence is valid or not.

We create a stack `stack` of characters to hold the opening brackets that have not yet been closed. We then traverse string `s`, and in each iteration, we check if the character is an opening or closing bracket. If it is an opening bracket, we push it to the `stack` and move ahead. However, if it is a closing bracket, we match it with the most recent unclosed bracket, which is at the top of the `stack`. If the bracket at the top of the stack is the opening pair of the current closing bracket, we pop it from the stack and move ahead. Otherwise, we conclude that the sequence is invalid.

In the end, we return true if the stack is empty; otherwise, we return false if the stack is not empty. It means not all opening brackets have a closing bracket in the sequence, and hence, it is invalid.

// Diagram: Validate the sequence of brackets

The implementation of the sequence validation technique is given below.

C++

```cpp
#include <stack>

// Diagram: using namespace std;

class Solution {
public:
    bool isMatchingPair(char opening, char closing) {
        return (opening == '(' && closing == ')') ||
               (opening == '{' && closing == '}') ||
               (opening == '[' && closing == ']');
    }

// Diagram: bool parenthesesChecker(string s) {

        // Create a stack to store the opening parentheses
        stack<char> stack;

        // Iterate through each character in the string
        for (auto ch : s) {

            // If the character is an opening parenthesis, push it onto
            // the stack
            if (ch == '(' || ch == '{' || ch == '[') {
                stack.push(ch);
            }

            // If the character is a closing parenthesis
            else {

                // If the stack is empty, the closing parenthesis does
                // not match the corresponding opening parenthesis
                // Return false as the string is invalid
                if (stack.empty() || !isMatchingPair(stack.top(), ch)) {
                    return false;
                }

                // Remove the corresponding opening parenthesis from the
                // stack
                stack.pop();
            }

        // If the stack is empty at the end, the string is valid
        return stack.empty();
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public boolean isMatchingPair(char opening, char closing) {
        return (
            (opening == '(' && closing == ')') ||
            (opening == '{' && closing == '}') ||
            (opening == '[' && closing == ']')
        );
    }

// Diagram: public boolean parenthesesChecker(String s) {

        // Create a stack to store the opening parentheses
        Stack<Character> stack = new Stack<>();

        // Iterate through each character in the string
        for (char ch : s.toCharArray()) {

            // If the character is an opening parenthesis, push it onto
            // the stack
            if (ch == '(' || ch == '{' || ch == '[') {

                // Push opening parentheses onto the stack
                stack.push(ch);
            }

            // If the character is a closing parenthesis
            else {

                // If the stack is empty, the closing parenthesis does
                // not match the corresponding opening parenthesis
                // Return false as the string is invalid
                if (
                    stack.isEmpty() || !isMatchingPair(stack.peek(), ch)
                ) {
                    return false;
                }

                // Remove the corresponding opening parenthesis from the
                // stack
                stack.pop();
            }

        // If the stack is empty at the end, the string is valid
        return stack.isEmpty();
    }
```

Typescript

```typescript
export class Solution {
    isMatchingPair(opening: string, closing: string): boolean {
        return (
            (opening === "(" && closing === ")") ||
            (opening === "{" && closing === "}") ||
            (opening === "[" && closing === "]")
        );
    }

// Diagram: parenthesesChecker(s: string): boolean {

        // Create a stack to store the opening parentheses
        const stack: string[] = [];

        // Iterate through each character in the string
        for (const ch of s) {

            // If the character is an opening parenthesis, push it onto
            // the stack
            if (ch === "(" || ch === "{" || ch === "[") {

                // Push opening parentheses onto the stack
                stack.push(ch);
            }

            // If the character is a closing parenthesis
            else {

                // If the stack is empty, the closing parenthesis does
                // not match the corresponding opening parenthesis
                // Return false as the string is invalid
                if (
                    stack.length === 0 ||
                    !this.isMatchingPair(stack[stack.length - 1], ch)
                ) {
                    return false;
                }

                // Remove the corresponding opening parenthesis from the
                // stack
                stack.pop();
            }

        // If the stack is empty at the end, the string is valid
        return stack.length === 0;
    }
```

Javascript

```javascript
export class Solution {
    isMatchingPair(opening, closing) {
        return (
            (opening === "(" && closing === ")") ||
            (opening === "{" && closing === "}") ||
            (opening === "[" && closing === "]")
        );
    }

// Diagram: parenthesesChecker(s) {

        // Create a stack to store the opening parentheses
        const stack = [];

        // Iterate through each character in the string
        for (let ch of s) {

            // If the character is an opening parenthesis, push it onto
            // the stack
            if (ch === "(" || ch === "{" || ch === "[") {

                // Push opening parentheses onto the stack
                stack.push(ch);
            }

            // If the character is a closing parenthesis
            else {

                // If the stack is empty, the closing parenthesis does
                // not match the corresponding opening parenthesis
                // Return false as the string is invalid
                if (
                    stack.length === 0 ||
                    !this.isMatchingPair(stack[stack.length - 1], ch)
                ) {
                    return false;
                }

                // Remove the corresponding opening parenthesis from the
                // stack
                stack.pop();
            }

        // If the stack is empty at the end, the string is valid
        return stack.length === 0;
    }
```

Python

```python
from typing import List

class Solution:
    def is_matching_pair(self, opening: str, closing: str) -> bool:
        return (
            (opening == "(" and closing == ")")
            or (opening == "{" and closing == "}")
            or (opening == "[" and closing == "]")
        )

    def parentheses_checker(self, s: str) -> bool:

        # Create a stack to store the opening parentheses
        stack: list[str] = []

        # Iterate through each character in the string
        for ch in s:

            # If the character is an opening parenthesis, push it onto
            # the stack
            if ch == "(" or ch == "{" or ch == "[":

                # Push opening parentheses onto the stack
                stack.append(ch)

            # If the character is a closing parenthesis
            else:

                # If the stack is empty, the closing parenthesis does
                # not match the corresponding opening parenthesis
                # Return false as the string is invalid
                if not stack or not self.is_matching_pair(stack[-1], ch):
                    return False

                # Remove the corresponding opening parenthesis from the
                # stack
                stack.pop()

        # If the stack is empty at the end, the string is valid
        return not stack
```

The sequence validation technique solves the problem in a single pass and linear**O(N)**time.

## Example problems

Most problems in this category are **medium** or **hard**; a list of a few is given below.

> -   **[Parentheses checker](https://www.codeintuition.io/courses/stack/OKZo9ke865ywNj1ECqKQi)**
> -   **[Minimum edits](https://www.codeintuition.io/courses/stack/xOiqPTIPomYaO4TQhC-Wt)**
> -   **[Redundant parentheses](https://www.codeintuition.io/courses/stack/2T4Nmjs8Wafb-8gOhOHE_)**
> -   **[Balanced span](https://www.codeintuition.io/courses/stack/twbNWvogfP2PmsZ-VDIbg)**

We will now solve these problems to understand the sequence validation technique better.

***

# Parentheses checker

## Problem Statement

Given a string **s** containing just the characters `(`, `{`, `[`, `)`, `}` and `]` . Write a function to determine if the input string is valid or not. Your function should return `true` if the string is valid. If not, return `false`. Below are the conditions for a string to be balanced

> -   Open brackets must be closed by the same type of brackets
> -   Open brackets must be closed in the correct order.

### Example 1

> -   **Input:** s = ()
> -   **Output:** true
> -   **Explanation:** The parentheses in the above string are balanced.

### Example 2

> -   **Input:** s = (({}))\[\]
> -   **Output:** true
> -   **Explanation:** The parentheses in the above string are balanced.

### Example 3

> -   **Input:** s = ({{)\[\]
> -   **Output:** false
> -   **Explanation:** The parentheses in the above string are not balanced.

## Solution

```cpp
#include <stack>

using namespace std;

class Solution {
public:
    bool isMatchingPair(char opening, char closing) {
        return (opening == '(' && closing == ')') ||
               (opening == '{' && closing == '}') ||
               (opening == '[' && closing == ']');
    }

    bool parenthesesChecker(string s) {

        // Create a stack to store the opening parentheses
        stack<char> stack;

        // Iterate through each character in the string
        for (auto ch : s) {

            // If the character is an opening parenthesis, push it onto
            // the stack
            if (ch == '(' || ch == '{' || ch == '[') {
                stack.push(ch);
            }

            // If the character is a closing parenthesis
            else {

                // If the stack is empty, the closing parenthesis does
                // not match the corresponding opening parenthesis
                // Return false as the string is invalid
                if (stack.empty() || !isMatchingPair(stack.top(), ch)) {
                    return false;
                }

                // Remove the corresponding opening parenthesis from the
                // stack
                stack.pop();
            }
        }

        // If the stack is empty at the end, the string is valid
        return stack.empty();
    }
};
```

***

# Minimum edits

## Problem Statement

Given a string **s** consisting of opening and closing parentheses, write a function to find and return the minimum number of insertions or deletions required to get a valid parentheses sequence.

> -   In an insert operation you could either insert a \`(\` or insert a \`)\`.
> -   In an delete operation you could either delete a \`(\` or delete a \`)\`.

### Example 1

> -   **Input:** s = ())
> -   **Output:** 1
> -   **Explanation:** To make the sequence valid, we can either insert an opening parenthesis \`(\` at the start of the string to match an unmatched closing parenthesis, or delete one of the unmatched closing parentheses \`)\`.

### Example 2

> -   **Input:** s = ))
> -   **Output:** 2
> -   **Explanation:** To make the sequence valid, we can either delete the two unmatched closing parentheses \`)\` or insert two opening parentheses \`(\` at the appropriate positions.

### Example 3

> -   **Input:** s = (((())))
> -   **Output:** 0
> -   **Explanation:** No edits are required, as the parentheses sequence is already valid.

## Solution

```cpp
#include <algorithm>
#include <stack>

using namespace std;

class Solution {
public:
    int minimumEdits(string s) {

        // Stack to track unmatched '('
        stack<char> stack;

        // Count of edits needed
        int edits = 0;

        for (char c : s) {

            // If '(', push to stack to find a match later
            if (c == '(') {
                stack.push(c);
            }

            // Else if ')', try to match with a '('
            else {

                // Found a ')', check for matching '('
                if (!stack.empty() && stack.top() == '(') {

                    // Found a match, pop the '(' from stack
                    stack.pop();
                }

                // No matching '(', need an edit
                else {

                    // Need to insert a '(' before this ')' or delete
                    // this ')' which counts as one edit
                    edits++;
                }
            }
        }

        // Any unmatched '(' in stack need to be closed with ')' edits
        // plus the edits we made for unmatched ')'
        return stack.size() + edits;
    }
};
```

***

# Redundant parentheses

## Problem Statement

Given a string **s** containing a balanced expression that can contain opening and closing parenthesis, write a function to check if it contains any redundant parenthesis. Your function should return `true` if it contains redundant parentheses, if not, return `false`.

### Example 1

> -   **Input:** s = ((2+3))+7
> -   **Output:** true

### Example 2

> -   **Input:** s = (2+3)
> -   **Output:** false

### Example 3

> -   **Input:** s = ((2+3)+7)
> -   **Output:** false

## Solution

```cpp
#include <stack>

using namespace std;

class Solution {
public:
    bool redundantParentheses(string s) {

        // Edge case for single pair of parentheses
        if (s == "()") {
            return false;
        }

        // Create a stack to store characters
        stack<char> stack;

        // Iterate through each character in the string
        for (char ch : s) {

            // If the character is a closing parenthesis
            if (ch == ')') {

                // If top of stack is an opening parenthesis, it's
                // redundant
                if (!stack.empty() && stack.top() == '(') {
                    return true;
                }

                // Pop elements until we find the corresponding '('
                while (!stack.empty() && stack.top() != '(') {
                    stack.pop();
                }

                // Pop the '(' as well
                stack.pop();
            }

            // If the character is not a closing parenthesis, push it
            // onto the stack
            else {
                stack.push(ch);
            }
        }

        // No redundant parentheses found
        return false;
    }
};
```

***

# Balanced span

## Problem Statement

Given a string **s** consisting of opening and closing parenthesis, write a function to find and return the length of the longest balanced parenthesis in it.

> -   Open brackets must be closed by the same type of brackets
> -   Open brackets must be closed in the correct order.

### Example 1

> -   **Input:** s = ((()()
> -   **Output:** 4
> -   **Explanation:** The longest valid parentheses is ()().

### Example 2

> -   **Input:** s = (()())(()
> -   **Output:** 6
> -   **Explanation:** The longest valid parentheses is (()()).

### Example 3

> -   **Input:** s = ((((
> -   **Output:** 0
> -   **Explanation:** There are no valid parentheses in the string.

## Solution

```cpp
#include <algorithm>
#include <stack>

using namespace std;

class Solution {
public:
    int balancedSpan(string s) {
        stack<int> stack;
        int maxLength = 0;

        // Push -1 to handle base case when there's no match
        stack.push(-1);
        for (int i = 0; i < s.size(); ++i) {

            // If the character is an opening parenthesis push its index
            // to the stack
            if (s[i] == '(') {
                stack.push(i);
            }

            // If the character is a closing parenthesis
            else {

                // Pop the last element
                stack.pop();

                // Push the current index if the stack is empty
                if (stack.empty()) {
                    stack.push(i);
                }

                // Otherwise, calculate the length of the valid substring
                else {
                    maxLength = max(maxLength, i - stack.top());
                }
            }
        }

        return maxLength;
    }
};
```
