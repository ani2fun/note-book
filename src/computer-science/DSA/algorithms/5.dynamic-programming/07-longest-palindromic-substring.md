# Understanding the longest palindromic substring problem

In many string-processing applications, finding patterns within text is a very common problem. One such pattern is a palindrome, a sequence of characters that reads the same both forwards and backwards. When analyzing a single string, we often want to identify the longest contiguous segment that reads the same forward and backwards. This is known as the longest palindromic substring problem, in which the objective is to find the longest substring in the input string that forms a palindrome.

// Diagram: Find the length of the longest palindromic substring in a string.

The longest palindromic substring problem is a classic problem in dynamic programming and has practical applications in DNA sequence analysis for identifying genetic markers, text processing for pattern recognition, data compression algorithms, and natural language processing tasks.

In this lesson, we will learn about the longest palindromic substring problem and how it can be solved efficiently using a dynamic programming solution.

## The longest palindromic substring problem

Consider we are given a string `s` of length `n`. A substring is defined as a contiguous sequence of characters within the string.

// Diagram: A string of length n

A palindrome is a string that reads the same forwards and backwards, such as "racecar" or "aba". We need to find the length of the longest substring of s that is also a palindrome.

// Diagram: The longest palindromic substring in the given string

### Optimal substructure

It is easy to prove that the optimal solution to the longest palindromic substring problem can be constructed from optimal solutions to its smaller subproblems. It is important to observe that if we consider a substring `s[i...j]`, there are two main cases to consider based on our choices.

For any substring `s[i...j]` to be a palindrome, the first and last characters must match, and the substring between them must also be a palindrome.

// Diagram: For the substring s\[i...j\] to be a palindrome, s\[i\] should be equal to s\[j\] and the substring s\[i-1...j-1\] should be a palindrome.

If `s[i]` equals `s[j]`, then we can check whether the inner substring `s[i+1...j-1]` forms a palindrome. If it does, then `s[i...j]` is also a palindrome by including both `s[i]` and `s[j]`. If `s[i]` equals `s[j]`, but the inner substring `s[i+1...j-1]` does not form a palindrome, the substring `s[i...j]` cannot be a palindrome.

// Diagram: If s\[i\] is equal to s\[j\], the substring s\[i...j\] is a palindrome only if the substring s\[i-1...j-1\] is also a palindrome.

When `s[i]` and `s[j]` are equal, and the inner substring is not a palindrome, `s[i]` and `s[j]` could still be a part of the longest palindromic substring in the range. If the inner substring is the longest palindromic substring in `s[i...j]`, it could be the longest palindromic substring within `s[i+1...j]` or the longest palindromic substring within `s[i...j-1]`.

// Diagram: is not a palndrome

Similarly, if `s[i]` and `s[j]` are not equal, the substring `s[i...j]` cannot form a palindrome. However, we might find that the longest palindromic substring within `s[i...j]` that doesn't actually use one or both boundary characters. Meaning, in this case, the longest palindromic substring in `s[i...j]` could be the longest palindromic substring within `s[i+1...j]` or the longest palindromic substring within `s[i...j-1]`.

// Diagram: If s\[i\] and s\[j\] are not equal, they can still be a part of another palindromic substring in the range s\[i...j\].

Based on the above, it is clear that to determine whether `s[i...j]` contains a palindrome and find the longest one, we have two options to choose from:

-   If `s[i]` equals `s[j]` and `s[i+1...j-1]` is a palindrome, then `s[i...j]` is a palindrome of length `(j - i + 1)`, which is the longest palindromic substring in this range
-   If `s[i]` does not equal `s[j]`, or if the inner substring is not a palindrome, we must take the better of the two options:

The solution to the problem depends on the optimal solution of these smaller subproblems.

// Diagram: The solution to the problem depends on the optimal solution of these smaller subproblems.

Note that the subproblems are uniquely identified by two dimensions: the starting index `i` and the ending index `j` of the substring.

Based on the optimal substructure above, we can define the relationship between the problem and its subproblems. We can define a function `isPalindrome(i, j)` that returns whether `s[i...j]` is a palindrome, and a function `lps(i, j)` that returns the length of the longest palindromic substring within `s[i...j]`.

// Diagram: Define functions lps and isPalindrome to find the length of the longest palindromic substring and check if a substring is a palindrome.

The base cases are:

-   Any single character is a palindrome and so, `isPalindrome(i, i) = true` and `lps(i, i) = 1`.
-   Any substring where `i > j` is empty and so `isPalindrome(i, j) = false` and `lps(i, j) = 0`.

// Diagram: The base cases for the lps and isPalindrome functions.

To determine `isPalindrome(i, j)`, we check whether `s[i]` equals `s[j]` and whether `isPalindrome(i+1, j-1)` is `true`.

// Diagram: The recurrence relation for the isPalindrome function.

For `lps(i, j)`, if `isPalindrome(i, j)` is `true`, then the answer is `j - i + 1`. Otherwise, we take the **maximum** of `lps(i+1, j)` and `lps(i, j-1)`.

Note that there are two recursive functions `isPalindrome` and `lps`, where the `lps` depends on results from `isPalindrome`.

The recurrence relation below expresses the solution to the problem as a function of solutions to smaller problems. The solution to the original problem is `lps(0, n-1)` where n is the length of `s`.

// Diagram: The recurrence relation for the longest palindromic substring function.

### Overlapping Subproblems

It is easy to see that there are many overlapping subproblems in the recurrence relation to solve the longest palindromic substring problem. To compute `lps(i, j)`, we may recursively compute `isPalindrome(i, j)`, which itself requires `isPalindrome(i+1, j-1)`. Additionally, we may need to compute both `lps(i+1, j)` and `lps(i, j-1)` when the current range is not a palindrome.

// Diagram: There are many overlapping subproblems when finding the solution to a problem state.

Conversely, the subproblem `lps(i, j)` appears in the computation of `lps(i-1, j)`, `lps(i, j+1)`.

// Diagram: A problem state may appear as a subproblem in many other problem states.

A brute-force recursive backtracking solution repeatedly recomputes the same subproblems when it reaches them from different paths, which makes it highly inefficient. Because these overlapping subproblems exist, the problem can be solved more efficiently either with a top-down dynamic programming approach using memoization or a bottom-up dynamic programming approach starting from the base cases.
