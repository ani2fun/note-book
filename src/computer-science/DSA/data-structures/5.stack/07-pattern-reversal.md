# 7. Pattern: Reversal

## Table of contents

1. [Understanding the reversal pattern](#understanding-the-reversal-pattern)
2. [Identifying the reversal pattern](#identifying-the-reversal-pattern)
3. [Stack inversion](#stack-inversion)
4. [Reverse the string](#reverse-the-string)
5. [Reverse an array](#reverse-an-array)
6. [Reverse word order](#reverse-word-order)

***

# Understanding the reversal pattern

We can access data items anywhere in sequential data structures like arrays and linked lists either via random access or traversal. However, inserting and accessing data in a stack is only restricted to one end in the stack giving it its unique LIFO (Last in first out) property.

The reversal technique leverages the LIFO property of a stack to reverse any sequence of data by inserting all the items into the stack and then retrieving them one at a time from the top. This way, the resulting sequence from the retrieved items will be in reverse order. Almost all sequences that can be reversed using a stack can also be reversed using another technique. 

The reversal pattern is a classification of problems that can be solved using the reversal technique using a stack.

// Diagram: The reversal technique uses a stack to reverse a sequence.

## The reversal technique

The reversal technique is quite simple and easy to understand. Consider we are given an array of data items `arr` that we need to reverse.

We create a stack `stack` that will hold the data items in `arr`. We then iterate in the array `arr` from start to end and in each iteration, push the current item on top of the stack. At the end of all iterations, all items in the array `arr` will be copied to the stack, with the last item at the top. We then iterate in the array `arr` again from start to end, and in each iteration, pop the item from the top of the stack and overwrite the current item in `arr` with it. At the end of all iterations, the stack `stack` will be empty, and the array `arr` will be reversed.

Reverse an array using a stack.

## Algorithm

The algorithm given below outlines the reversal technique using a stack to reverse an array.

> **Algorithm**
>
> -   **Step 1:** Initialize a stack \`stack\` to store the data items of the array \`arr\`
> -   **Step 2:** Iterate in the array \`arr\` from start to end and push each item to the top of the stack \`stack\`.
> -   **Step 3:** Iterate in the array \`arr\` from start to end, pop the item from the top of the stack \`stack\` and overwrite the current item in\`arr\` with it.

## Implementation

Given below is the generic code implementation to reverse an array of integers using a stack.

// Diagram: Loading code editor

## Complexity Analysis

The algorithm's time and space complexity is easy to understand. We traverse the sequence from start to end twice, in any case, and since adding an item to the top of the stack is a constant time operation, the runtime complexity is linear **O(N)**.

We copy all the data items to the stack in the first iteration, essentially duplicating the data before clearing it in the second iteration. Hence, the space complexity for the algorithm is linear **O(N)**.

> **Best Case -**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**
>
> **Worst Case -**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

Later in the course, we will examine techniques for identifying problems that can be solved using the reversal technique and walk through an example to better understand it.

***

# Identifying the reversal pattern

The reversal technique can be applied to all problems where we need to reverse a sequential data structure. These are generally **easy** problems where reversal is only a subproblem of the bigger problem. If the problem statement or its solution follows the generic template below, it can be solved using the reversal technique.

**Template:**

// Diagram: Reverse a sequential data structure

## Example

To better understand the problems that can be solved using the reversal technique, let's consider the following problem and see how we can identify it as a direct application of the two-pointer technique.

> **Problem statement**: Given a string \`s\` return its reversed string.

// Diagram: Reverse a string

## Reversal using stack

The problem statement fits the generic template we learned earlier.

// Diagram: Reverse a sequential data structure (string s)

We create a stack of characters `stack` to hold the characters in the string `s`. We then iterate in string `s` from start to end, and in each iteration, push the current character to the top of the stack. At the end of all iterations, all items in the string `s` will be copied to the stack, with the last item at the top.

We then create an empty string `result`, pop items from the stack, and append them to the string `result` until the stack is empty. At the end of all iterations `result` will hold the reversed string of `s`.

// Diagram: Reverse a string using a stack

The implementation of the reversal technique using stack is given below.

C++

```cpp
#include <stack>

// Diagram: using namespace std;

class Solution {
public:
    string reverseTheString(string s) {

        // Create a stack to store characters
        stack<char> stack;

        // Create an empty string to store the reversed string
        string result;

        // Push each character into the stack
        for (char ch : s) {
            stack.push(ch);
        }

        // Pop characters from the stack to form the reversed string
        while (!stack.empty()) {

            // Append the top character to the result string
            result += stack.top();
            stack.pop();
        }

        // Return the reversed string
        return result;
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public String reverseTheString(String s) {

        // Create a stack to store characters
        Stack<Character> stack = new Stack<>();

        // Create an empty string to store the reversed string
        StringBuilder result = new StringBuilder();

        // Push each character into the stack
        for (char ch : s.toCharArray()) {
            stack.push(ch);
        }

        // Pop characters from the stack to form the reversed string
        while (!stack.empty()) {

            // Append the top character to the result string
            result.append(stack.pop());
        }

        // Return the reversed string
        return result.toString();
    }
```

Typescript

```typescript
export class Solution {
    reverseTheString(s: string): string {

        // Create a stack to store characters
        const stack: string[] = [];

        // Create an empty string to store the reversed string
        let result: string = "";

        // Push each character into the stack
        for (const ch of s) {
            stack.push(ch);
        }

        // Pop characters from the stack to form the reversed string
        while (stack.length > 0) {

            // Append the top character to the result string
            result += stack.pop();
        }

        // Return the reversed string
        return result;
    }
```

Javascript

```javascript
export class Solution {
    reverseTheString(s) {

        // Create a stack to store characters
        const stack = [];

        // Create an empty string to store the reversed string
        let result = "";

        // Push each character into the stack
        for (const ch of s) {
            stack.push(ch);
        }

        // Pop characters from the stack to form the reversed string
        while (stack.length > 0) {

            // Append the top character to the result string
            result += stack.pop();
        }

        // Return the reversed string
        return result;
    }
```

Python

```python
from typing import List

class Solution:
    def reverse_the_string(self, s: str) -> str:

        # Create a stack to store characters
        stack: List[str] = []

        # Create an empty string to store the reversed string
        result: str = ""

        # Push each character into the stack
        for ch in s:
            stack.append(ch)

        # Pop characters from the stack to form the reversed string
        while stack:

            # Append the top character to the result string
            result += stack.pop()

        # Return the reversed string
        return result
```

## Example problems

Most problems that fall under this category are**easy**problems; a list of a few is given below.

> -   **[Stack inversion](https://www.codeintuition.io/courses/stack/OKiemileoITxeb1dzad7n)**
> -   **[Reverse the string](https://www.codeintuition.io/courses/stack/7GV2qQH7l8O7VWjDf3gJh)**
> -   **[Reverse an array](https://www.codeintuition.io/courses/stack/lXukTGYnlC7uLI5boRBAP)**
> -   **[Reverse word order](https://www.codeintuition.io/courses/stack/m5Q62NeArW9t-7ZPQqSIJ)**

We will now solve these problems to understand the reversal technique using stack better.

***

# Stack inversion

## Problem Statement

Given a stack **s**, write a function to return a new stack that contains all the elements of this stack but in reversed order.

### Example

> -   **Input:** s = \[9, 5, 1, 2\]
> -   **Output:** \[2, 1, 5, 9\]
> -   **Explanation:** Above is the diagram to show the reversed stack.

## Solution

```cpp
#include <stack>

using namespace std;

class Solution {
public:
    stack<int> stackInversion(stack<int> &s) {
        stack<int> reversedStack;

        // Transfer elements from original stack to reversed stack
        while (!s.empty()) {

            // Get the top element from the original stack
            int top = s.top();

            // Remove the top element from the original stack
            s.pop();

            // Push the element onto the reversed stack
            reversedStack.push(top);
        }

        // Return the reversed stack
        return reversedStack;
    }
};
```

***

# Reverse the string

## Problem Statement

Given a string **s** containing alphanumeric characters, write a function to reverse this string using stack and return the reversed string. 

### Example 1

> -   **Input:** s = abcdefgh
> -   **Output:** hgfedcba
> -   **Explanation:** Above is the reversed string.

### Example 2

> -   **Input:** s = c
> -   **Output:** c
> -   **Explanation:** Above is the reversed string.

## Solution

```cpp
#include <stack>

using namespace std;

class Solution {
public:
    string reverseTheString(string s) {

        // Create a stack to store characters
        stack<char> stack;

        // Create an empty string to store the reversed string
        string result;

        // Push each character into the stack
        for (char ch : s) {
            stack.push(ch);
        }

        // Pop characters from the stack to form the reversed string
        while (!stack.empty()) {

            // Append the top character to the result string
            result += stack.top();
            stack.pop();
        }

        // Return the reversed string
        return result;
    }
};
```

***

# Reverse an array

## Problem Statement

Given an array **arr** containing integers, write a function to reverse the elements of this array using a stack. Your function should not return a new array but modify the input array itself.

### Example 1

> -   **Input:** arr = \[1, 2, 3, 4, 5, 6\]
> -   **Output:** \[6, 5, 4, 3, 2, 1\]
> -   **Explanation:** Above is the reversed array.

### Example 2

> -   **Input:** arr = \[\]
> -   **Output:** \[\]
> -   **Explanation:** Above is the reversed array.

## Solution

```cpp
#include <stack>

using namespace std;

class Solution {
public:
    void reverseAnArray(vector<int> &arr) {

        // Create a stack to store elements of arr
        stack<int> stack;

        // Pushing elements of arr into the stack
        for (int i = 0; i < arr.size(); i++) {
            stack.push(arr[i]);
        }

        int counter = 0;

        // Popping elements from the stack and storing them back into arr
        // in reverse order
        while (!stack.empty()) {
            arr[counter++] = stack.top();
            stack.pop();
        }
    }
};
```

***

# Reverse word order

## Problem Statement

Given a string **s** containing multiple words, write a function to reverse the string without reversing the actual words in the string and return the updated string.

### Example 1

> -   **Input:** s = This is a string
> -   **Output:** string a is This
> -   **Explanation:** Above is the reversed string.

### Example 2

> -   **Input:** s = abc
> -   **Output:** abc
> -   **Explanation:** Above is the reversed string.

## Solution

```cpp
#include <algorithm>
#include <stack>

using namespace std;

class Solution {
public:
    stack<string> buildStackOfWords(string s) {

        // Create a stack to store words
        stack<string> stack;

        // Variable to store each word
        string word;

        // Iterate through each character in the input string
        for (char ch : s) {

            // If the character is not a space, add it to the word
            if (ch != ' ') {
                word += ch;
            }

            // If a space is encountered and the word is not empty
            // Push the word onto the stack
            else if (!word.empty()) {
                stack.push(word);

                // Reset the word
                word = "";
            }
        }

        // Push the last word onto the stack if it's not empty
        if (!word.empty()) {
            stack.push(word);
        }

        return stack;
    }

    string reverseWordOrder(string s) {
        stack<string> stackOfWords = buildStackOfWords(s);

        // Variable to store the reversed string
        string reversedString;

        // Pop words from the stack and append them to the reversedString
        while (!stackOfWords.empty()) {
            reversedString += stackOfWords.top() + " ";
            stackOfWords.pop();
        }

        // Remove the trailing space at the end
        if (!reversedString.empty()) {

            reversedString.pop_back();
        }

        // Return the reversed string without reversing the words
        return reversedString;
    }
};
```
