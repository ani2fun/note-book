# Understanding the maximum predicate search pattern

There are many problems where we may not be given a sorted sequence, but an ordered search space where every input may either be a valid solution or not. The maximum predicate search algorithm generalizes the binary search algorithm to find the maximum value that satisfies a predicate function. It is the natural counterpart of the minimum predicate pattern and can solve a wide variety of optimization problems.

The maximum predicate pattern is a classification of problems that can be solved using maximum predicate search algorithm.

// Diagram: The maximum predicate search is the technique to find the maximum value in the search space after which the predicate flips.

In this lesson, we will learn more about using the lower bound to solve problems where we need to find the maximum predicate and how to identify a problem as a maximum predicate search pattern problem.

## The maximum predicate search problem

Consider we have a search space defined by an ordered set `S` where values are sorted in non-decreasing order, and a predicate function `p` that takes as input values from the set `S` and returns either `true` or `false`. The results of the predicate function `p` are monotonic over the search space and flip only once from `true` to `false` or from `false` to `true`.

// Diagram: A monotonic sequence of true and false, starting from true, that flips once over a sorted space.

The goal is to find the maximum value in `S` , **after** which the predicate result flips.

// Diagram: The maximum value in the search space after which the predicate value flips.

Depending on the problem, the predicate result may start from `false` and flip to `true` or start from `true` and flip to `false`.

// Diagram: The predicate may flip from false to true or from true to false.

In this lesson, we will consider the case where the predicate results flip from `true` to `false`. This means that, if `p(x)` is `true` then `p(y)` will also be `true` for all `y < x`, and if `p(x)` is `false` `p(y)` will also be `false` for all `y > x`. The goal of the problem is to find the maximum input `x` in `S` for which `p(x)` yields `true`.

The same solution can be used to find the maximum `false` if the predicate results start from `false` and flip to `true` in the ordered set `S`.

// Diagram: The predicate starts with true values and flips to false values.

The maximum predicate search problem can be solved using generalized binary search. This is because the constraints of the problem enforce that for an increasing order of `x` in `S`, the series `p(x)` will always be monotonic, flipping only once from `true` to `false`. This allows us to make the same assumptions as binary search, which facilitates skipping the unwanted half of an array in each iteration.

The idea is quite simple, we start by setting the variables `low` and `high` to the minimum and maximum (inclusive) values in the search space `S`. We iterate until `low < high`, and in each iteration, find the middle of the range in a variable `mid`. If the predicate `p(mid)` is `true`, it means all values in `S` that are less than or equal to `mid` also have a `true` predicate value, and mid could potentially be the last (maximum) value for which the predicate is `true` and potentially be the final solution. And so we set `low = mid` for the next iteration.

On the other hand, `p(mid)` is `false`, it means all values in `S` that are greater than or equal to `mid` also have `false` predicate values. And so we set `mid = high -1`. This way, we discard the unwanted range in each iteration and reduce the size of the problem domain by half.

At the end of all iterations, when `low` becomes equal to `high` and `low` has the **maximum** value in `S` for which the predicate is `true`. However, there could be an edge case where all predicate values are `false`, and so, we need to check if the `p(low)` is `true` at the end of all iterations. If it is `true`, `low` is the solution; otherwise, we return an error to the caller as defined by the problem.

// Diagram: Find the maximum value in the search space after which, the predicate function flips from true to false

## Algorithm

The algorithm below summarizes the binary search solution to find the maximum value, after which the predicate result flips from `true` to `false` in a series that starts with `true`.

> **maximumPredicate()**
>
> -   **Step 1:** Set `low` to the minimum value in the search space
> -   **Step 2:** Set `high` to the maximum value in the problem search space
> -   **Step 3:** Iterate while `low` < `high` and do the following:
>     -   **Step 3.1:** Set `mid` = `low` + (`high` - `low`) / 2
>     -   **Step 3.2:** If `p(mid)` is `true`, set `low` = `mid`
>     -   **Step 3.3:** Otherwiese if `p(mid)` is `false`, set `high` = `mid` - 1
> -   **Step 4:** If `p(low)` is `false` return an error as there is no `true` predicate
> -   **Step 5:** Return `low` as the solution

## Implementation

Given below is the generic code implementation to find the maximum value, after which the predicate results flip from `true` to `false` in a series starting with `true` predicate results. The boundaries of the search spaces are held in `low` and `high`.

To modify the implementation for a series that starts with `false` values and flips to `true` values, we can change `p ( mid )` to `! p ( mid )` to find the maximum value, after which the predicate result flips to `true`.

C++

```cpp

class Solution {
public:

// Diagram: int maximumPredicate() {

        int low = 1; // The minimum valid value in the search space
        int high = 1e7; // The maximum valid value in the search space

        // Perform binary search to find the maximum true predicate
        while (low < high) {

            // Find the middle of the current search space
            int mid = low + (high - low) / 2;

            // If the predicate is true at mid, search in the higher half
            if (p(mid)) {
                // Set low to mid as mid might be the maximum true predicate
                low = mid;
            }

            // If the predicate is false at mid, search in the lower half
            else {
                // Since all values greater than mid are also false, move high down
                high = mid - 1;
            }

        // After the loop, low should point to the maximum true predicate
        if (!p(low)) {
            return -1; // All inputs are false
        }

        // Return input for the maximum true predicate
        return low;
    }
private:
    // Example predicate function (to be replaced with actual logic)
    bool p(int x) {
        // Implement your predicate logic here
        return x >= 1000;
    }
};
```

Java

```java
class Solution {

// Diagram: public int maximumPredicate() {

        int low = 1; // The minimum valid value in the search space
        int high = (int) 1e7; // The maximum valid value in the search space

        // Perform binary search to find the maximum true predicate
        while (low < high) {

            // Find the middle of the current search space
            int mid = low + (high - low + 1) / 2; // +1 prevents infinite loop when low == mid

            // If the predicate is true at mid, search in the higher half
            if (p(mid)) {
                // Set low to mid as mid might be the maximum true predicate
                low = mid;
            }

            // If the predicate is false at mid, search in the lower half
            else {
                // Since all values greater than mid are also false, move high down
                high = mid - 1;
            }

        // After the loop, low should point to the maximum true predicate
        if (!p(low)) {
            return -1; // All inputs are false
        }

        // Return input for the maximum true predicate
        return low;
    }

    // Example predicate function (to be replaced with actual logic)
    private boolean p(int x) {
        // Implement your predicate logic here
        return x >= 1000;
    }

    // Example driver for testing
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.maximumPredicate());
    }
```

Typescript

```typescript
class Solution {
  maximumPredicate(): number {
    let low = 1; // The minimum valid value in the search space
    let high = 1e7; // The maximum valid value in the search space

    // Perform binary search to find the maximum true predicate
    while (low < high) {
      // Find the middle of the current search space
      const mid = low + Math.floor((high - low + 1) / 2); // +1 prevents infinite loop

      // If the predicate is true at mid, search in the higher half
      if (this.p(mid)) {
        // Set low to mid as mid might be the maximum true predicate
        low = mid;
      }

      // If the predicate is false at mid, search in the lower half
      else {
        // Since all values greater than mid are also false, move high down
        high = mid - 1;
      }

    // After the loop, low should point to the maximum true predicate
    if (!this.p(low)) {
      return -1; // All inputs are false
    }

    // Return input for the maximum true predicate
    return low;
  }

  // Example predicate function (to be replaced with actual logic)
  private p(x: number): boolean {
    // Implement your predicate logic here
    return x >= 1000;
  }
```

Javascript

```javascript
class Solution {

// Diagram: maximumPredicate() {

    let low = 1; // The minimum valid value in the search space
    let high = 1e7; // The maximum valid value in the search space

    // Perform binary search to find the minimum true predicate
    while (low < high) {

      // Find the middle of the current search space
      let mid = Math.floor(low + (high - low + 1) / 2); // +1 avoids infinite loops

      // If the predicate is true at mid, search in the higher half
      if (this.p(mid)) {
        // Set low to mid as mid might be the maximum true predicate
        low = mid;
      }

      // If the predicate is false at mid, search in the lower half
      else {
        // Since all values greater than mid are also false, move high down
        high = mid - 1;
      }

    // After the loop, low should point to the maximum true predicate
    if (!this.p(low)) {
      return -1; // All inputs are false
    }

    // Return input for the maximum true predicate
    return low;
  }

  // Example predicate function (to be replaced with actual logic)
  p(x) {
    // Implement your predicate logic here
    return x >= 1000;
  }
```

Python

```python
class Solution:
    def maximumPredicate(self) -> int:
        low: int = 1  # The minimum valid value in the search space
        high: int = int(1e7)  # The maximum valid value in the search space

        # Perform binary search to find the minimum true predicate
        while low < high:

            # Find the middle of the current search space
            mid: int = low + (high - low) // 2

            # If the predicate is true at mid, search in the higher half
            if self.p(mid):
                # Set low to mid as mid might be the maximum true predicate
                low = mid

            # If the predicate is false at mid, search in the lower half
            else:
                # Since all values greater than mid are also false, move high down
                high = mid - 1

        # After the loop, low should point to the maximum true predicate
        if not self.p(low):
            return -1  # All inputs are false

        # Return input for the maximum true predicate
        return low

    # Example predicate function (to be replaced with actual logic)
    def p(self, x: int) -> bool:
        # Implement your predicate logic here
        return x >= 1000
```

## Complexity Analysis

The algorithm's time and space complexity are easy to understand. We have the two variables `low` and `high` that hold start and end of the current search space respectively, and in each iteration, we reduce the size of the search space by half. If we assume that the predicate function p takes constant time and space and the initial size of the problem space is **N**, the time complexity in any case is **O(log(N))**.

Since we don't create only a fixed number of extra variables during the execution of the algorithm, the space complexity **O(1)** is constant in any case.

> **Any case -**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(log(N))**

Later in the course, we will examine techniques for identifying problems that can be solved using the maximum predicate algorithm and walk through an example to better understand it.

***

# Example | Searching | Codeintuition

// Diagram: Identifying the maximum predicate search pattern

The maximum predicate search algorithm is the counterpart to the minimum predicate search that is used to find the last (maximum) point in a sorted search space after which a monotonic boolean function (predicate) changes its value, assuming it changes only once. It is a very powerful technique that can solve many optimization and feasibility problems in logarithmic time.

These are generally easy or medium problems where we have a large sorted search space, and we need to define a predicate function that verifies if certain constraints are met. The goal is to find the last (maximum) value in the search space after which the result of the predicate function flips.

If the problem statement or its solution follows the generic template below, it can be solved using the maximum predicate search algorithm.

**Template:**

Given a predicate function that results in a monotonic sequence that flips once from `true` to `false` or `false` to `true` over a sorted search space, find the maximum value in the search space after which the result flips.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the maximum predicate search algorithm.

> **Problem statement:** You are given an array `ribbons`, where `ribbons\[i\]` denotes the length of the `ith` ribbon and a non-negative integer `k`. You can cut any of the ribbons in any number of segments of positive size or not cut them at all. Write a function to find and return the maximum length of ribbons so that you have `k` ribbons of that length. You can ignore any excess ribbons. Return `0` if you cannot obtain `k` ribbons of the same length.

// Diagram: Find the maximum length of ribbons we can cut to get at least 10 ribbons.

### The maximum predicate search solution

On closely observing the problem, we can see that if there exists a length `Li` for which we can cut at least `k` ribbons of length `Li`, we can also cut `k` ribbons for any length smaller than `Li`. This is because we can cut the same ribbons as before, only making the cuts smaller.

Similarly, if there is a length `Lj`, for which we cannot cut at least `k` ribbons of length `Lj`, we can also not cut `k` ribbons for any length greater than `Lj`. 

// Diagram: For all lengths <= Li, we can cut at least k ribbons, and for all lengths >= Lj, we cannot cut at least k ribbons.

And so, there will be a **maximum** length `L` beyond which we will not be able to cut at least `k` ribbons of length `L`.

// Diagram: The maximum length L for which we can cut at least k ribbons.

We create a function `canCut` that takes as input the `ribbons` array, a length `length` and `k`, and returns whether we can cut at least `k` ribbons of length `k` from the `ribbons` array as `true` or `false`. We initialise a variable, `count`, to 0 and iterate over the `ribbons` array.

In each iteration, we get the number of pieces we get on cutting the current ribbon pieces of size `length` by dividing the length of the current ribbon by `length` and ignoring the fractional part. We then add the result to `count`. In the end, we return `true` if `count >= k` ; otherwise, we return `false`.

Below is the execution of the `canCut` function for two different values, one for which we can cut at least `k` ribbons and the other for which we cannot.

Given below is a case when we **can** cut at least `k` ribbons for the given `length`.

// Diagram: Find if we can cut > 10 ribbons of length 2

Given below is a case when we **cannot** cut at least `k` ribbons for the given `length`.

// Diagram: Find if we can cut > 10 ribbons of length 8

The results from the `canCut` function over an increasing value of `length` will be a monotonic series that starts with a `true` value and gradually flips to `false`, depending on the array `ribbons` and `k`.

// Diagram: canCut(ribbons, length, k)

We need to find the maximum value of `length` after which the monotonic function `canCut` flips from `true` to `false`.  This fits the generic template for the maximum predicate search pattern, where `canCut` is the predicate function, and the integer range from 1 to the maximum length of ribbons from the `ribbons` array is the search space for `length`.

**Template:**Given a predicate function (`canCut`) that results in a monotonic sequence that flips once from `true` to `false` over a sorted search space (1 to the maximum length of ribbons), find the maximum value in the search space after which the result flips.

To find the maximum length of ribbons we can cut, we initialise two variables, `low` and `high`, with `1` and the maximum length of all ribbons, respectively. This is because we cannot cut all ribbons to a length greater than the length of the longest ribbon. We iterate until `low < high`, and in each iteration, find the middle of the range in a variable `mid`.

We then check if the function `canCut` returns `true` for `mid`. If it does, it means `mid`  could potentially be the last (maximum) length for which we can cut at least `k` ribbons, and so we set `low = mid` for the next iteration. Otherwise, if `canCut` returns`false`, it means we can't cut at least k ribbons for lengths greater than or equal to `mid`, and so we set `high = mid - 1` for the next iteration.

At the end of all iterations, when`low`becomes equal to`high` and `low`potentially has the maximum length for which we can cut at least `k` ribbons. time. We return it as the maximum length if `canCut` returns `true` for `low` ; otherwise, we return `0` as we can't cut `k` ribbons of equal length.

Below is the execution of the maximum predicate search solution for the problem using the `canCut` function.

Find the maximum length of ribbons we can cut to get at least 10 ribbons.

The implementation of the maximum predicate search solution is given as follows. 

C++

```cpp
using namespace std;

class Solution {
public:

    // Predicate: checks if it's possible to cut at least 'k' ribbons of
    // length 'length'
    bool canCut(vector<int> &ribbons, int length, int k) {
        int count = 0;

        // Count how many pieces of 'length' we can cut from each ribbon
        for (int ribbon : ribbons) {
            count += ribbon / length;
        }

        // Return true if we can cut at least 'k' ribbons of this length
        return count >= k;
    }

// Diagram: int kRibbons(vector<int> &ribbons, int k) {

        // Initialize the search range for ribbon lengths
        int low = 1;

        // Initialize the search range for ribbon lengths
        int high = 1e7;

// Diagram: while (low < high) {

            // Calculate the middle value by adding 1 to get upper mid to
            // prevent infinite loop when low and high are adjacent
            int mid = low + (high - low + 1) / 2;

            // If we can cut at least 'k' ribbons of length 'mid' it is a
            // possible answer, so update the lower boundary to mid
            if (canCut(ribbons, mid, k)) {

                // Try to find a larger length
                low = mid;
            }

            // Otherwise, we can't cut 'k' ribbons of length 'mid' from
            // the given ribbons array.
            else {

                // Try to find a smaller length
                high = mid - 1;
            }

        // After the search, low is the maximum length we can cut
        // Check if we can actually cut at least 'k' ribbons of this
        // length
        if (!canCut(ribbons, low, k)) {
            return 0;
        }

        // Return the maximum ribbon length that can be obtained
        return low;
    }
};
```

Java

```java
class Solution {

    // Predicate: checks if it's possible to cut at least 'k' ribbons of
    // length 'length'
    private boolean canCut(int[] ribbons, int length, int k) {
        int count = 0;

        // Count how many pieces of 'length' we can cut from each ribbon
        for (int ribbon : ribbons) {
            count += ribbon / length;
        }

        // Return true if we can cut at least 'k' ribbons of this length
        return count >= k;
    }

// Diagram: public int kRibbons(int[] ribbons, int k) {

        // Initialize the search range for ribbon lengths
        int low = 1;

        // Initialize the search range for ribbon lengths
        int high = (int) 1e7;

// Diagram: while (low < high) {

            // Calculate the middle value by adding 1 to get upper mid to
            // prevent infinite loop when low and high are adjacent
            int mid = low + (high - low + 1) / 2;

            // If we can cut at least 'k' ribbons of length 'mid' it is a
            // possible answer, so update the lower boundary to mid
            if (canCut(ribbons, mid, k)) {

                // Try to find a larger length
                low = mid;
            }

            // Otherwise, we can't cut 'k' ribbons of length 'mid' from
            // the given ribbons array.
            else {

                // Try to find a smaller length
                high = mid - 1;
            }

        // After the search, low is the maximum length we can cut
        // Check if we can actually cut at least 'k' ribbons of this
        // length
        if (!canCut(ribbons, low, k)) {
            return 0;
        }

        // Return the maximum ribbon length that can be obtained
        return low;
    }
```

Typescript

```typescript
export class Solution {

    // Predicate: checks if it's possible to cut at least 'k' ribbons of
    // length 'length'
    canCut(ribbons: number[], length: number, k: number): boolean {
        let count = 0;

        // Count how many pieces of 'length' we can cut from each ribbon
        for (const ribbon of ribbons) {
            count += Math.floor(ribbon / length);
        }

        // Return true if we can cut at least 'k' ribbons of this length
        return count >= k;
    }

// Diagram: kRibbons(ribbons: number[], k: number): number {

        // Initialize the search range for ribbon lengths
        let low = 1;

        // Initialize the search range for ribbon lengths
        let high = 1e7;

// Diagram: while (low < high) {

            // Calculate the middle value by adding 1 to get upper mid to
            // prevent infinite loop when low and high are adjacent
            const mid = low + Math.floor((high - low + 1) / 2);

            // If we can cut at least 'k' ribbons of length 'mid' it is a
            // possible answer, so update the lower boundary to mid
            if (this.canCut(ribbons, mid, k)) {

                // Try to find a larger length
                low = mid;
            }

            // Otherwise, we can't cut 'k' ribbons of length 'mid' from
            // the given ribbons array.
            else {

                // Try to find a smaller length
                high = mid - 1;
            }

        // After the search, low is the maximum length we can cut
        // Check if we can actually cut at least 'k' ribbons of this
        // length
        if (!this.canCut(ribbons, low, k)) return 0;

        // Return the maximum ribbon length that can be obtained
        return low;
    }
```

Javascript

```javascript
export class Solution {

    // Predicate: checks if it's possible to cut at least 'k' ribbons of
    // length 'length'
    canCut(ribbons, length, k) {
        let count = 0;

        // Count how many pieces of 'length' we can cut from each ribbon
        for (const ribbon of ribbons) {
            count += Math.floor(ribbon / length);
        }

        // Return true if we can cut at least 'k' ribbons of this length
        return count >= k;
    }

// Diagram: kRibbons(ribbons, k) {

        // Initialize the search range for ribbon lengths
        let low = 1;

        // Initialize the search range for ribbon lengths
        let high = 1e7;

// Diagram: while (low < high) {

            // Calculate the middle value by adding 1 to get upper mid to
            // prevent infinite loop when low and high are adjacent
            const mid = low + Math.floor((high - low + 1) / 2);

            // If we can cut at least 'k' ribbons of length 'mid' it is a
            // possible answer, so update the lower boundary to mid
            if (this.canCut(ribbons, mid, k)) {

                // Try to find a larger length
                low = mid;
            }

            // Otherwise, we can't cut 'k' ribbons of length 'mid' from
            // the given ribbons array.
            else {

                // Try to find a smaller length
                high = mid - 1;
            }

        // After the search, low is the maximum length we can cut
        // Check if we can actually cut at least 'k' ribbons of this
        // length
        if (!this.canCut(ribbons, low, k)) return 0;

        // Return the maximum ribbon length that can be obtained
        return low;
    }
```

Python

```python
from typing import List

class Solution:

    # Predicate: checks if it's possible to cut at least 'k' ribbons of
    # length 'length'
    def can_cut(self, ribbons: List[int], length: int, k: int) -> bool:
        count = 0

        # Count how many pieces of 'length' we can cut from each ribbon
        for ribbon in ribbons:
            count += ribbon // length

        # Return true if we can cut at least 'k' ribbons of this length
        return count >= k

    def k_ribbons(self, ribbons: List[int], k: int) -> int:

        # Initialize the search range for ribbon lengths
        low = 1

        # Initialize the search range for ribbon lengths
        high = int(1e7)

        while low < high:

            # Calculate the middle value by adding 1 to get upper mid to
            # prevent infinite loop when low and high are adjacent
            mid = low + (high - low + 1) // 2

            # If we can cut at least 'k' ribbons of length 'mid' it is a
            # possible answer, so update the lower boundary to mid
            if self.can_cut(ribbons, mid, k):

                # Try to find a larger length
                low = mid

            # Otherwise, we can't cut 'k' ribbons of length 'mid' from
            # the given ribbons array.
            else:

                # Try to find a smaller length
                high = mid - 1

        # After the search, low is the maximum length we can cut
        # Check if we can actually cut at least 'k' ribbons of this
        # length
        if not self.can_cut(ribbons, low, k):
            return 0

        # Return the maximum ribbon length that can be obtained
        return low
```

## Example problems

Most problems in this category are **easy** or **medium**; a list of a few is given below.

> -   **[Calculate square root](https://www.codeintuition.io/courses/searching/9wr9aI8J94fcWy6DNamE0)**
> -   **[Build staircase](https://www.codeintuition.io/courses/searching/0manbJXDpn5idUwtOOGSJ)**
> -   **[K ribbons](https://www.codeintuition.io/courses/searching/Yp2zWpXUa74ainlhr4nlM)**
> -   **[Equalise water](https://www.codeintuition.io/courses/searching/JKDOgf2409LyYslQdyx3K)**

We will now solve these problems to understand the maximum predicate search pattern better.

***

# Calculate square root

## Problem Statement

Given a non-negative integer **num**, write a function to find and return its square root rounded down to the nearest integer.

You must do this in a time complexity of `O(logN)` without using any built in libraries.

### Example 1

> -   **Input:** num = 4
> -   **Output:** 2
> -   **Explanation:** The square root of 4 is 2.

### Example 2

> -   **Input:** num = 5
> -   **Output:** 2
> -   **Explanation:** The square root of 5 is 2.23606, which, when rounded down, is 2.

### Example 3

> -   **Input:** num = 50
> -   **Output:** 7
> -   **Explanation:** The square root of 5 is 7.07106, which, when rounded down, is 7.

## Solution

```cpp
using namespace std;

class Solution {
public:

    // Predicate: checks if square of mid is less than or equal to num
    bool isSquare(int mid, int num) {
        return mid <= num / mid;
    }

    int calculateSquareRoot(int num) {
        if (num == 0) {
            return 0;
        }

        // Lowest possible square root
        int low = 1;

        // Highest possible square root
        int high = num;

        while (low < high) {

            // Calculate the middle value by adding 1 to get upper mid to
            // prevent infinite loop when low and high are adjacent
            int mid = low + (high - low + 1) / 2;

            // If the square of mid is less than or equal to num, low is
            // a valid candidate. Update the lower boundary to mid
            if (isSquare(mid, num)) {
                low = mid;
            }

            // If the square of mid is greater than num, update the
            // higher boundary
            else {
                high = mid - 1;
            }
        }

        // Return the last valid candidate rounded down to
        // the nearest integer
        return low;
    }
};
```

***

# Build staircase

## Problem Statement

You are given **n** coins to build a staircase, the `ith` stair of this staircase will need `i` coins to build. The last stair of this staircase can be incomplete. Write a function to find and return the number of complete staircase stairs you can build with these n coins.

You must do this in a time complexity of `O(logN)`.

### Example 1

> -   **Input:** n = 6
> -   **Output:** 3
> -   **Explanation:** We can build 3 stairs with 1 + 2 + 3 = 6 coins.

### Example 2

> -   **Input:** n = 5
> -   **Output:** 2
> -   **Explanation:** We can build 2 stairs with 1 + 2 = 3 coins after which we will only have 2 coins left with which we cannot build the 3rd stair.

### Example 3

> -   **Input:** n = 7
> -   **Output:** 3
> -   **Explanation:** We can build 3 stairs with 1 + 2 + 3 = 6 coins after which we will only have 1 coin left with which we cannot build the 4th stair.

## Solution

```cpp
using namespace std;

class Solution {
public:

    // Predicate: Checks if mid rows can fit within n blocks
    bool canBuild(int mid, int n) {

        // sum of first mid natural numbers: mid*(mid+1)/2
        return mid * (mid + 1) / 2 <= n;
    }

    int buildStaircase(int n) {

        // Lowest possible value for a complete row
        int low = 0;

        // Highest possible value for a complete row
        int high = n;

        while (low < high) {

            // Calculate the middle value by adding 1 to get upper mid to
            // prevent infinite loop when low and high are adjacent
            int mid = low + (high - low + 1) / 2;

            // If we can build mid rows, this is a possible answer
            // Update the lower boundary to mid
            if (canBuild(mid, n)) {
                low = mid;
            }

            // The sum is larger, search in the left half
            else {
                high = mid - 1;
            }
        }

        // Return the largest complete row smaller than the given sum
        return low;
    }
};
```

***

# K ribbons

## Problem Statement

You are given an array **ribbons**, where `ribbons[i]` denotes the length of the `ith` ribbon and a non-negative integer **k**. You can cut any of the ribbons in any number of segments of positive size or not cut them at all. Write a function to find and return the maximum length of ribbons so that you have k ribbons of that length. You can ignore any excess ribbons. Return `0` if you cannot obtain k ribbons of the same length.

### Example 1

> -   **Input:** ribbons = \[9, 7, 5\], k = 3
> -   **Output:** 5
> -   **Explanation:** Below steps involved:
> -   Cut the first ribbon into two ribbons, one of length 5 and one of length 4.
> -   Cut the second ribbon into two ribbons, one of length 5 and one of length 2.
> -   Keep the third ribbon as it is.

### Example 2

> -   **Input:** ribbons = \[9, 7, 5\], k = 4
> -   **Output:** 4
> -   **Explanation:** Below steps involved:
> -   Cut the second ribbon into two ribbons, one of length 4 and one of length 3.
> -   Cut the third ribbon into two ribbons, one of length 4 and one of length 1.
> -   Cut the first ribbon into three ribbons, two of length 4 and one of length 1.

### Example 3

> -   **Input:** ribbons = \[9, 7, 5\], k = 30
> -   **Output:** 0
> -   **Explanation:** We cannot make 30 ribbons from the given set of ribbons.

## Solution

```cpp
using namespace std;

class Solution {
public:

    // Predicate: checks if it's possible to cut at least 'k' ribbons of
    // length 'length'
    bool canCut(vector<int> &ribbons, int length, int k) {
        int count = 0;

        // Count how many pieces of 'length' we can cut from each ribbon
        for (int ribbon : ribbons) {
            count += ribbon / length;
        }

        // Return true if we can cut at least 'k' ribbons of this length
        return count >= k;
    }

    int kRibbons(vector<int> &ribbons, int k) {

        // Initialize the search range for ribbon lengths
        int low = 1;

        // Initialize the search range for ribbon lengths
        int high = 1e7;

        while (low < high) {

            // Calculate the middle value by adding 1 to get upper mid to
            // prevent infinite loop when low and high are adjacent
            int mid = low + (high - low + 1) / 2;

            // If we can cut at least 'k' ribbons of length 'mid' it is a
            // possible answer, so update the lower boundary to mid
            if (canCut(ribbons, mid, k)) {

                // Try to find a larger length
                low = mid;
            }

            // Otherwise, we can't cut 'k' ribbons of length 'mid' from
            // the given ribbons array.
            else {

                // Try to find a smaller length
                high = mid - 1;
            }
        }

        // After the search, low is the maximum length we can cut
        // Check if we can actually cut at least 'k' ribbons of this
        // length
        if (!canCut(ribbons, low, k)) {
            return 0;
        }

        // Return the maximum ribbon length that can be obtained
        return low;
    }
};
```

***

# Equalise water

## Problem Statement

You are given an array **buckets**, where `buckets[i`\] denotes the water in litres of the `ith` bucket and an integer **loss**. You want to make the amount of water in each bucket equal. To do so, you can pour any amount of water from one bucket to another. However, every time you do so, you lose a loss% of the water you transferred. Write a function to find and return the maximum amount of water in each bucket after equalising the amount.

// Diagram: You have a tolerance factor of 1e-5 when comparing floating point numbers

### Example 1

> -   **Input:** buckets = \[1, 5, 10\], loss = 20
> -   **Output:** 5.00000
> -   **Explanation:** We pour 5 litres from the last bucket to the first bucket. Since the loss is 20%, we lose 1 litre in the process, so we are only able to pour 4 litres effectively.

### Example 2

> -   **Input:** buckets = \[2, 4, 6\], loss = 50
> -   **Output:** 3.50000
> -   **Explanation:** We pour 0.5 litres from the second bucket to the first bucket. Since the loss is 50%, we lose 0.25 litres in the process, so we can only pour 0.25 litres effectively. This makes the buckets as \[2.25, 3.5, 6\]. Now, we pour 2.5 litres from the last bucket to the first bucket. Because of a 50% loss, we can only transfer 1.25 litres while losing the other 1.25 litres. This makes the buckets \[3.5, 3.5, 3.5\].

### Example 3

> -   **Input:** buckets = \[10, 10, 10, 10\], loss = 40
> -   **Output:** 10.00000
> -   **Explanation:** All buckets already have the same amount of water.

## Solution

```cpp
#include <algorithm>
#include <cmath>

using namespace std;

class Solution {
public:

    // Scale factor to avoid floating-point precision issues while
    // performing binary search. We scale all water amounts by 1e5
    // and perform integer arithmetic instead of floating-point.
    int SCALE = 1e5;

    // Predicate: checks if it's possible to make all buckets contain at
    // least 'target' liters of water
    bool canAchieveTarget(vector<int> &buckets, int loss, int target) {

        // Total water that can be transferred to other buckets
        long long totalExcess = 0;

        // Total water needed to fill the buckets
        long long totalDeficit = 0;

        for (long long water : buckets) {

            // Scale the water amount to avoid floating-point precision
            water *= SCALE;

            // If water in the bucket is more than the target, calculate
            // the excess
            if (water > target) {

                // Water that can be effectively transferred
                totalExcess += ((water - target) * (100 - loss)) / 100;
            }

            // If water in the bucket is less than the target, calculate
            // the deficit
            else {

                // Water needed to fill this bucket
                totalDeficit += target - water;
            }
        }

        // We can achieve the target if totalExcess is greater than or
        // equal to totalDeficit
        return totalExcess >= totalDeficit;
    }

    double equaliseWater(vector<int> &buckets, double loss) {

        // Binary search range is [0, max(bucket)]
        int low = 0;

        // Binary search range is [0, max(bucket) * SCALE]
        int high = *max_element(buckets.begin(), buckets.end()) * SCALE;

        // Tolerance factor of 1e-5
        while (low < high) {

            // Calculate the middle target by adding 1 to get upper mid
            // to prevent infinite loop when low and high are adjacent
            int mid = low + (high - low + 1) / 2;

            // If we can achieve this target, this is a potential answer
            // So update the lower boundary to mid
            if (canAchieveTarget(buckets, loss, mid)) {

                // Try a larger target
                low = mid;
            }

            // If we can't achieve this target, try for a smaller target
            else {

                // Try a smaller target
                high = mid - 1;
            }
        }

        return static_cast<double>(high) / SCALE;
    }
};
```
