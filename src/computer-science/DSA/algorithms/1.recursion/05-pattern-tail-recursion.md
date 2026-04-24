# Understanding tail recursion

Tail recursion is the exact opposite of head recursion. A recursive function where the function calls itself at the end of the code block, just before returning to the caller, is a tail-recursive function. It is often used to model problems where the processing in a function call does not depend on results from any deeper recursive call. It is also used when some information has to be passed down from the caller to the called function to process its result, and the solution is built from **top to bottom**.

Tail recursion pattern is the classification of problems that can be solved using tail recursion.

// Diagram: The solution is built from top to bottom before making recursive calls in tail recursion.

## Tail recursion

As the name suggests, in tail recursion, the recursive function call occurs at the end (tail) of the code block, just before returning to the calling function. Consequently, all processing for a step is completed **before** making a recursive call, and no further processing occurs after the recursive call ends. The outcome of processing at each step is often passed down to the recursive call as an argument, typically as an aggregate.

Consider we have a recursive function that takes an input`n`and `aggregate`value from the caller. In its implementation, it processes the input `n` and `aggregate` and uses a function `g` that takes as input `n` and `aggregate` to computes `aggregate` for the next recursive call. It also uses a function `h` to reduce the input `n` for the next recursive call. This makes the general recursive equation for tail recursion the following form:

Note that not all tail-recursive functions carry the processed data as an aggregate. The generic equation below still applies; however, the aggregate term is optional and varies depending on the problem.

// Diagram: The general recursive equation for tail recursion.

The pseudocode for the general recursive equation above is as follows.

// Diagram: The pseudocode for the general equation for tail recursion.

Note that all the processing in the function `f` is completed **before** making any recursive call. The recomputed `aggregate` has the contribution of the processing at each step and is passed down as an argument. The recursive calls continue until we reach the base case, where a known solution is returned to the calling function, and the stack unwinds.

The aggregated data `aggregate` is often a non-primitive type, passed by reference to avoid making repeated copies in low-level programming languages. When the aggregated value is a primitive type, it can also be passed by value.Most high-level programming languages pass non-primitive data types by reference. A single copy of the data is created when the top-level recursive function is called and passed down through the recursion, where each step updates it.

// Diagram: The recursive calls are made at the beginning of the function and continue until reaching the base case.

Every step in the recursive function calls adds its contribution to `aggregate` received from its caller and passes the new updated values down as arguments until it hits the base case. And so, the base case receives the aggregated data that has contributions from all the steps above it.

// Diagram: Every step adds its contribution to the aggregate before passing it to the recursive call.

Once we hit the base case, the aggregated data passed down is used to process the result for the base case. The function then returns to the calling function, passing this result back, and the stack unwinds. Since the recursive call is at the end, the calling function also passes the same data back to its caller without any further processing, and this process is repeated until the top-level recursive function call is finished. And so, the caller of the top-level recursive function actually gets the result straight from the deepest call (base case).

Tail recursion aggregates data top to bottom from the top-level recursive call to the base case via successive recursive calls.

// Diagram: The base case returns a known result, which is passed to the caller of the top-level recursive function as the stack unwinds.

Since the recursive call for a tail-recursive function is at the end, it behaves similarly to an iterative loop, where the data is processed in each iteration before moving to the next iteration.

// Diagram: Tail-recursive functions can be implemented iteratively.

Just like head recursion, for tail recursion, the data can be passed down from the caller to the called function and back up in many different ways, the choice of which depends on the problem, programming language and ease of implementation.

## Passing data down

Since a recursive function call is at the end of the function code block, all processing in the function is already done before making the recursive call. And so, in most cases, this processed data is passed down to the recursive function as the `aggregate` argument.

For low-level programming languages like C++, the arguments are always passed by copy. And so, locally created `aggregate` data is copied when passed as arguments to the recursive function call. This incurs a copy overhead every time a recursive call is made and can be less performant when `aggregate` is a container-type data structure like arrays, lists, trees, etc.

// Diagram: In low-level programming languages, data passed as arguments is passed as a copy.

For cases where the function `g` does **not update** the passed `aggregate` value, but instead returns an updated value. Every instance of a function call can store the updated value in a local variable `newAggregate` and pass down the **local** **reference** to the recursive call. This way, every instance of a function call holds a reference to `newAggregate` in its caller that it can use in its call to the function `g` as `aggregate`, reducing the number of copies being created.

In high-level programming languages like Java, JavaScript and Python, arguments are usually always passed by reference, and so, this is the default behaviour if a local variable `newAggregate` is created at every step.

// Diagram: The aggregate data passed to the recursive function can be passed by reference to prevent unnecessary copies.

On the other hand, for cases where the function `g` **updates** the passed `aggregate` value instead of returning an updated value, the updated value can simply be passed as a **reference** to the next recursive call. This way, only a single copy of `aggregate` can be created in the caller of the top-level recursive call that is passed down as a reference and shared by all instances of the recursive function. Every instance adds its contribution to `aggregate` using the function `g` before passing it down via a recursive call.

In high-level programming languages like Java, JavaScript and Python, arguments are usually always passed by reference, and so, this is the default behaviour if `aggregate` is created in the caller of the top-level recursive function.

// Diagram: My Awesome Creation

## Passing data up

The data can be passed up from the called function to the calling function either by returning a copy of its local variable or by updating a reference passed down by the caller. Both ways have their pros and cons, and the choice depends on the problem, programming language and the ease of implementation.

For tail recursion, data is usually always passed back as a return value. For low-level programming languages like C++, values are always returned by copy, which incurs a copy overhead every time a recursive function ends and can be less performant when passing container-type data structures like arrays, lists, trees, etc.

// Diagram: In low-level programming languages, data is returned to the caller by copy.

For high-level programming languages like Java, JavaScript and Python, all local data is also created on the heap memory and only references to it are local. And so, when a value is returned, the calling function stores the reference to the same object in its local variable.

// Diagram: In high-level programming languages, data is returned by reference.

To avoid unnecessary copy operations in low-level programming languages when non-primitive datatypes are involved, we can create a single copy of the data of the return type `solution` in the caller of the top-level recursive function and pass it down as a reference. Then, the recursive function doesn't need to return a value; it can update the data held in the reference when a solution is found. This way, there is always a single copy of  `solution`, which is updated in the base case with the final result.

In high-level programming languages like Java, JavaScript and Python, arguments are usually always passed by reference, and so, this is the default behaviour if `solution` is created in the caller of the top-level recursive function.

// Diagram: The solution can be passed by reference as an argument to the recursive calls, which updates it at every step.

There is no one right or wrong way to pass data up and down in tail recursion, and the choice depends on the problem and the programming language used. The performance of these operations varies across different programming languages, depending on the number of copies made of the arguments and returned data.

In most cases of tail recursion, `aggregate` is usually passed down as a reference to a single copy, and the `solution` is passed back up as a return value. This means that all data is passed down as reference and back up as copies for C++ and as references for high-level programming languages (non-primitive data types). So, we will only look at this pattern in the algorithm and implementation section.

## Algorithm

The steps given below summarise the implementation for the generic tail-recursive function, where `aggregate` is passed down as a reference, and `solution` is passed back up to the calling function as a return value.

> **tailRecursion(input, \[ref\] aggregate)**
>
> -   **Step 1:** If \`input\` is the base case, return the known solution for \`(input, aggregate)\`
> -   **Step 2:** Update \`aggregate\` by calling \`g(input, aggregate)\`
> -   **Step 3:** Set \`newInput\` = \`h(input)\`
> -   **Step 3:** Set \`solution\` = Call \`tailRecursion(newInput, aggregate)\`
> -   **Step 4:** Return \`solution\`

## Implementation

Given below is the implementation for the generic tail-recursive equation using tail recursion, where the function `g` updates the passed aggregate value in place. The `aggregate` is passed down as a reference, and the `solution` is passed back up as the return value.

C++

```cpp
using namespace std;

class Solution {
public:
    int tailRecursion(int n, vector<int>& aggregate) {

        // Base case: If n is less than or equal to 0, we have reached
        // the end of recursion
        if (n <= 0) {
            return aggregate.size(); // Return the size of the aggregate as an example
        }

        // Use the function h to reduce the input
        // for the next step
        int input = h(n);

        // Use the function g to update aggregate
        // for the next step
        g(n, aggregate);

        // Recursive call with the reduced input
        // at the end of the function
        int solution = tailRecursion(input, aggregate);

        // Return the solution for the current input
        return solution;
    }
private:
    // Placeholder for g - update the aggregate using recursive call
    // the current input to the previous aggregate
    void g(int n, vector<int>& aggregate) {
        // Implement your logic here
        if (n % 2 == 0) {
          aggregate.push_back(n); // Example implementation
        }

    // Placeholder for h - get the input for the next step
    // the output
    int h(int n) {
        // Implement your logic here
        return n - 1; // Example implementation
    }
};
```

Java

```java
import java.util.ArrayList;

// Diagram: class Solution {

// Diagram: public int tailRecursion(int n, ArrayList<Integer> aggregate) {

        // Base case: If n is less than or equal to 0, we have reached
        // the end of recursion
        if (n <= 0) {
            return aggregate.size(); // Return the size of the aggregate as an example
        }

        // Use the function h to reduce the input
        // for the next step
        int input = h(n);

        // Use the function g to update aggregate
        // for the next step
        g(n, aggregate);

        // Recursive call with the reduced input
        // at the end of the function
        int solution = tailRecursion(input, aggregate);

        // Return the solution for the current input
        return solution;
    }

    // Placeholder for g - update the aggregate using recursive call
    // the current input to the previous aggregate
    private void g(int n, ArrayList<Integer> aggregate) {
        // Implement your logic here
        if (n % 2 == 0) {
            aggregate.add(n); // Example implementation
        }

    // Placeholder for h - get the input for the next step
    // the output
    private int h(int n) {
        // Implement your logic here
        return n - 1; // Example implementation
    }
```

Typescript

```typescript
class Solution {
    tailRecursion(n: number, aggregate: number[]): number {

        // Base case: If n is less than or equal to 0, we have reached
        // the end of recursion
        if (n <= 0) {
            return aggregate.length; // Return the size of the aggregate as an example
        }

        // Use the function h to reduce the input
        // for the next step
        const input = this.h(n);

        // Use the function g to update aggregate
        // for the next step
        this.g(n, aggregate);

        // Recursive call with the reduced input
        // at the end of the function
        const solution = this.tailRecursion(input, aggregate);

        // Return the solution for the current input
        return solution;
    }

    // Placeholder for g - update the aggregate using recursive call
    // the current input to the previous aggregate
    private g(n: number, aggregate: number[]): void {
        // Implement your logic here
        if (n % 2 === 0) {
            aggregate.push(n); // Example implementation
        }

    // Placeholder for h - get the input for the next step
    // the output
    private h(n: number): number {
        // Implement your logic here
        return n - 1; // Example implementation
    }
```

Javascript

```javascript
class Solution {
    tailRecursion(n, aggregate) {

        // Base case: If n is less than or equal to 0, we have reached
        // the end of recursion
        if (n <= 0) {
            return aggregate.length; // Return the size of the aggregate as an example
        }

        // Use the function h to reduce the input
        // for the next step
        let input = this.h(n);

        // Use the function g to update aggregate
        // for the next step
        this.g(n, aggregate);

        // Recursive call with the reduced input
        // at the end of the function
        let solution = this.tailRecursion(input, aggregate);

        // Return the solution for the current input
        return solution;
    }

    // Placeholder for g - update the aggregate using recursive call
    // the current input to the previous aggregate
    g(n, aggregate) {
        // Implement your logic here
        if (n % 2 === 0) {
            aggregate.push(n); // Example implementation
        }

    // Placeholder for h - get the input for the next step
    // the output
    h(n) {
        // Implement your logic here
        return n - 1; // Example implementation
    }
```

Python

```python
from typing import List

class Solution:
    def tail_recursion(self, n: int, aggregate: List[int]) -> int:

        # Base case: If n is less than or equal to 0, we have reached
        # the end of recursion
        if n <= 0:
            return len(aggregate)  # Return the size of the aggregate as an example

        # Use the function h to reduce the input
        # for the next step
        input_value: int = self.h(n)

        # Use the function g to update aggregate
        # for the next step
        self.g(n, aggregate)

        # Recursive call with the reduced input
        # at the end of the function
        solution: int = self.tail_recursion(input_value, aggregate)

        # Return the solution for the current input
        return solution

    def g(self, n: int, aggregate: List[int]) -> None:
        # Placeholder for g - update the aggregate using recursive call
        # the current input to the previous aggregate
        # Implement your logic here
        if n % 2 == 0:
            aggregate.append(n)  # Example implementation

    def h(self, n: int) -> int:
        # Placeholder for h - get the input for the next step
        # Implement your logic here
        return n - 1  # Example implementation
```

## Complexity Analysis

The time complexity of the algorithm depends on the recursive equation, the functions `g` and `h` and the time taken to copy the return value. Assuming that the function calls itself recursively only once, where every call linearly increases or decreases the input, converging to the base case, and the functions `g` and `h` take constant **O(1)** time. 

Also, if we assume that the data passed is passed up and down for low-level programming languages as copy and the copy operation takes constant **O(1)** time or all data is passed up and down as references, the time complexity of the algorithm will be **O(N)**, where **N** is the number of recursive function calls.

For low-level languages like C++, if container-type data structures like arrays, trees, etc, are passed up or down as copies, it adds linear time complexity **O(M)** where **M** is the size of the container. This results in an overall time complexity of **O(N\*M)** in any case.

Since the function call stack goes up to a depth of **N** if there are **N** recursive calls, and every instance of the function call makes only a constant number of local variables, the space complexity is also linear **O(N)**,in any case.

We will learn more about non-linear recursion later in the course which may also be tail recursion but have exponential time complexity.

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

# Identifying tail recursion

Tail recursion is another fundamental form of recursion and can be seen as analogous to iterative loops. Most problems that are solved by tail recursion are **easy** or **medium** problems, where results are progressively built as recursive calls are made. All the processing in a function happens before the recursive call is made, and processed data is often passed down the recursive calls. The results in case of tail recursion are built in the top-to-bottom order.

Most recursive problems that allow carrying forward all the needed information in parameters (like an aggregate or some other state) and require no extra work after the recursive call can be solved with tail recursion.

It is important to note that most problems that can be solved using tail recursion can also be solved either iteratively or using other forms of recursion.

If the recursive equation for a problem fits in the template of the generic tail recursive equation, it can be solved by tail recursion.

// Diagram: The general recursive equation for tail recursion.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using tail recursion.

> **Problem statement:** Given a list of digits, find if it is a palindrome or not.

// Diagram: Find if the given list of digits is palindrome.

## Tail recursion

At first glance, checking whether a string is a palindrome may not seem like a recursive problem. However, by definition, a palindrome is inherently recursive in nature.  A palindrome remains a palindrome even if we repeatedly remove matching items from both ends. 

// Diagram: A palindrome is recursive in nature.

This recursive property allows us to express the problem in terms of smaller sub-problems, leading naturally to a recursive solution. The recursive equation for the problem is given below.

// Diagram: The recursive equation from the problem.

Note that there is no aggregate that is passed forward to the recursive calls in this case, as every step decides if the recursive call should continue or terminate. The recursive equation fits the template for a generic tail-recursive equation without the aggregate, and thus it can be solved using tail recursion. 

// Diagram: The recursive equation for the problem fits the template for tail recursion.

We create a recursive function that takes as input the list `arr` and the indices of the first and last items in the list `start` and `end` respectively. In each function, we check the items at `start` and `end` and if they match, we recursively call the same function on the same list, moving the indices one step closer to each other by incrementing `start` and decrementing `end` for the subsequent call. This way, the next call only considers the remaining list from `start + 1` to `end - 1`.

It is important to note that while there are three variables, `arr`, `start` and `end` that define the input, the recursion is still considered single-dimensional, as the three variables are dependent on each other, the problem space is reduced linearly.

The base case is when `start` and `end` overlap or cross each other, in which case we return `true`, as a list with a zero or a single item is a palindrome. If at any point during these function calls, the items at `start` and `end` don't match, we return `false`, terminating any further recursive calls.

Once a value is returned from a function call, either from the base case or when the items at the ends don't match, the return value is bubbled all the way back to the caller of the top-level recursive function.

The implementation of the tail-recursive solution to solve the problem is given below.

C++

```cpp
using namespace std;

class Solution {
public:
    bool helper(const vector<int> &arr, int start, int end) {

        // Base case: If start index crosses end index,
        // we have checked all elements
        if (start >= end) {
            return true;
        }

        // Check if the elements at the current indices are equal
        if (arr[start] != arr[end]) {
            return false;
        }

        // Recursive call moving towards the center of the list
        return helper(arr, start + 1, end - 1);
    }

    bool isPalindrome(vector<int> &arr) {
        return helper(arr, 0, arr.size() - 1);
    }
};
```

Java

```java
class Solution {
    private boolean helper(int[] arr, int start, int end) {

        // Base case: If start index crosses end index,
        // we have checked all elements
        if (start >= end) {
            return true;
        }

        // Check if the elements at the current indices are equal
        if (arr[start] != arr[end]) {
            return false;
        }

        // Recursive call moving towards the center of the list
        return helper(arr, start + 1, end - 1);
    }

    public boolean isPalindrome(int[] arr) {
        return helper(arr, 0, arr.length - 1);
    }
```

Typescript

```typescript
export class Solution {
    helper(arr: number[], start: number, end: number): boolean {

        // Base case: If start index crosses end index,
        // we have checked all elements
        if (start >= end) {
            return true;
        }

        // Check if the elements at the current indices are equal
        if (arr[start] !== arr[end]) {
            return false;
        }

        // Recursive call moving towards the center of the list
        return this.helper(arr, start + 1, end - 1);
    }

    isPalindrome(arr: number[]): boolean {
        return this.helper(arr, 0, arr.length - 1);
    }
```

Javascript

```javascript
export class Solution {
    helper(arr, start, end) {

        // Base case: If start index crosses end index,
        // we have checked all elements
        if (start >= end) {
            return true;
        }

        // Check if the elements at the current indices are equal
        if (arr[start] !== arr[end]) {
            return false;
        }

        // Recursive call moving towards the center of the list
        return this.helper(arr, start + 1, end - 1);
    }

    isPalindrome(arr) {
        return this.helper(arr, 0, arr.length - 1);
    }
```

Python

```python
from typing import List

class Solution:
    def helper(self, arr: List[int], start: int, end: int) -> bool:

        # Base case: If start index crosses end index,
        # we have checked all elements
        if start >= end:
            return True

        # Check if the elements at the current indices are equal
        if arr[start] != arr[end]:
            return False

        # Recursive call moving towards the center of the list
        return self.helper(arr, start + 1, end - 1)

    def is_palindrome(self, arr: List[int]) -> bool:
        return self.helper(arr, 0, len(arr) - 1)
```

The tail-recursive solution can solve this problem in linear time using a concise recursive implementation.

## Example problems

Most problems that fall under this category are**easy**problems; a list of a few is given below.

> -   **[Reverse sequence](https://www.codeintuition.io/courses/recursion/P_6VoX7uB5lZv7LjjSCHj)**
> -   **[Search element](https://www.codeintuition.io/courses/recursion/zDmzqOTS2xd5CP0HUENFp)**
> -   **[Is palindrome](https://www.codeintuition.io/courses/recursion/LYO4SeOabg9R7a3FrO-H6)**
> -   **[Reverse a list](https://www.codeintuition.io/courses/recursion/2ZNHf67nfwnoDWEr7AnnO)**

We will now solve these problems to gain a better understanding of tail recursion.

***

# Reverse sequence

## Problem Statement

Given a positive number **N**, write a function to return a list of numbers from N to 1.

You must do this **recursively**.

### Example

> -   **Input:** n = 5
> -   **Output:** \[5, 4, 3, 2, 1\]

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

        // First, add the current number N to the result vector
        result.push_back(N);

        // Recursive call to the helper function with N-1, to move
        // towards the base case
        helper(N - 1, result);
    }

    vector<int> reverseSquence(int N) {

        // Initialize an empty vector to store the result
        vector<int> result;

        // Call the helper function to populate the result vector with
        // numbers from N to 1
        helper(N, result);

        // Return the generated vector containing numbers from N to 1
        return result;
    }
};
```

***

# Search element

## Problem Statement

Given an integer array **arr** and an integer **target**, write a function to find and return the index of the target element in the array. Return `-1` if the element is not present in the array.

You must do this **recursively**.

### Example 1

> -   **Input:** arr = \[2, 8, 3, 6, 4\], target = 3
> -   **Output:** 2
> -   **Explanation:** The target element 3 is stored at index 2 in the array.

### Example 2

> -   **Input:** arr = \[1, 2, 3, 4, 5\], target = 5
> -   **Output:** 4
> -   **Explanation:** The target element 5 is stored at index 4 in the array.

### Example 3

> -   **Input:** arr = \[2, 8, 1, 9, 4\], target = 10
> -   **Output:** -1
> -   **Explanation:** The array does not have the target element.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int helper(vector<int> &arr, int target, int index) {

        // Base case: If index reaches the size of the array,
        // the target is not found
        if (index == arr.size()) {
            return -1;
        }

        // If the current element matches the target, return the index
        if (arr[index] == target) {
            return index;
        }

        // Recursive call to check the next element in the array
        return helper(arr, target, index + 1);
    }

    int searchElement(vector<int> &arr, int target) {
        return helper(arr, target, 0);
    }
};
```

***

# Is palindrome

## Problem Statement

Given an integer array **arr**, write a function that returns `true` if the array is palindrome or `false` otherwise.

A list is a palindrome if it reads the same forwards and backwards.

You must do this **recursively**.

### Example 1

> -   **Input:** arr = \[1, 2, 2, 1\]
> -   **Output:** true
> -   **Explanation:** The list reads the same forwards and backwards.

### Example 2

> -   **Input:** arr = \[1, 3, 2, 1\]
> -   **Output:** false
> -   **Explanation:** The list does not read the same forwards and backwards.

### Example 3

> -   **Input:** arr = \[\]
> -   **Output:** true
> -   **Explanation:** An empty list is a palindrome list as there is nothing to read.

## Solution

```cpp
using namespace std;

class Solution {
public:
    bool helper(const vector<int> &arr, int start, int end) {

        // Base case: If start index crosses end index,
        // we have checked all elements
        if (start >= end) {
            return true;
        }

        // Check if the elements at the current indices are equal
        if (arr[start] != arr[end]) {
            return false;
        }

        // Recursive call moving towards the center of the list
        return helper(arr, start + 1, end - 1);
    }

    bool isPalindrome(vector<int> &arr) {
        return helper(arr, 0, arr.size() - 1);
    }
};
```

***

# Reverse a list

## Problem Statement

Given the **head** of a singly linked list, write a function to reverse the list and return the head of the reversed list.

You need to reverse the list in place.

You must do this **recursively**.

### Example

> -   **Input:** head = \[5, 7, 3, 10\]
> -   **Output:** \[10, 3, 7, 5\]

## Solution

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    ListNode *helper(ListNode *current, ListNode *previous) {

        // Base case: If current is null, return previous
        // as the new head
        if (!current) {
            return previous;
        }

        // Save the next node before changing the link
        ListNode *next = current->next;

        // Reverse the link by pointing current's next
        // to previous
        current->next = previous;

        // Recursive call with next node and current as
        // previous
        return helper(next, current);
    }

    ListNode *reverseAList(ListNode *head) {

        // Call the helper function with head and null
        // as previous
        return helper(head, nullptr);
    }
};
```
