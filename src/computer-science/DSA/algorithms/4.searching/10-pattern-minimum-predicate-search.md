# Understanding the minimum predicate search pattern

Binary search is a very powerful search technique to search for an item in a sorted sequence. However, at its core, it's a decision-making technique that exploits the ordered nature of a sequence. There are many problems where we may not be given a sorted sequence, but an ordered search space where every input may either be a valid solution or not. The minimum predicate search algorithm generalizes the binary search algorithm to find the minimum value that satisfies a predicate function.

The minimum predicate pattern is a classification of problems that can be solved using minimum predicate search algorithm

// Diagram: The minimum predicate search is the technique to find the minimum value in the search space at which the predicate flips.

In this lesson, we will learn more about using the lower bound to solve problems where we need to find the minimum predicate and how to identify a problem as a minimum predicate search pattern problem.

## The minimum predicate search problem

Consider we have a search space defined by an ordered set `S` where values are sorted in non-decreasing order, and a predicate function `p` that takes as input values from the set `S` and returns either `true` or `false`. The results of the predicate function `p` are monotonic over the search space and flip only once from `true` to `false` or from `false` to `true`.

// Diagram: A monotonic sequence of true and false, starting from false, that flips once over a sorted space.

The goal of the problem is to find the minimum value in `S` where the predicate result first flips.

// Diagram: The minimum value in the search space where the predicate value flips.

Depending on the problem, the predicate result may start from `false` and flip to `true` or start from `true` and flip to `false`.

// Diagram: The predicate may flip from false to true or from true to false.

In this lesson, we will consider the case where the predicate results flip from `false` to `true`. This means that, if `p(x)` is `true` then `p(y)` will also be `true` for all `y > x`, and if `p(x)` is `false` `p(y)` will also be `false` for all `y < x`. The goal of the problem is to find the minimum input `x` in `S` for which `p(x)` yields `true`.

The same solution can be used to find the minimum `false` if the predicate results start from `true` and flip to `false` in the ordered set `S`.

// Diagram: The predicate starts with false values and flips to true values.

The minimum predicate search problem can be solved using the generalized binary search algorithm. This is because the constraints of the problem enforce that for an increasing order of `x` in `S`, the series `p(x)` will always be monotonic, flipping only once from `false` to `true`. This allows us to make the same assumptions as binary search, which facilitates skipping the unwanted half of an array in each iteration.

The idea is quite simple, we start by setting the variables `low` and `high` to the minimum and maximum (inclusive) values in the search space `S`. We iterate until `low < high`, and in each iteration, find the middle of the range in a variable `mid`.

If the predicate `p(mid)` is `true`, it means all values in `S` that are greater than or equal to `mid` also have `true` predicate values. This means `mid`  could potentially be the first (minimum) value for which the predicate is `true` and potentially be the final solution. And so we set `high = mid` for the next iteration. On the other hand, if the predicate `p(mid)` is `false`, it means all values in `S` that are less than or equal to `mid` also have a `false` predicate value, and so we set `low = mid + 1` for the next iteration. This way, we discard the unwanted range in each iteration and reduce the size of the search space by half.

At the end of all iterations, when `low` becomes equal to `high` and `low` potentially has the **minimum** value in `S` for which the predicate is `true`. However, there could be an edge case where all predicate values are `false`, and so, we need to check if the `p(low)` is `true` at the end of all iterations. If it is `true`, `low` is the solution; otherwise, we return an error to the caller as defined by the problem.

// Diagram: Find the minimum value in the search space where the predicate function flips from false to true

## Algorithm

The steps below summarizes the minimum predicate search algorithm to find the minimum value where the predicate result flips from `false` to `true` in a series that starts with `false`.

> **minimumPredicate()**
>
> -   **Step 1:** Set `low` to the minimum value in the search space
> -   **Step 2:** Set `high` to the maximum value in the problem search space
> -   **Step 3:** Iterate while `low` < `high` and do the following:
>     -   **Step 3.1:** Set `mid` = `low` + (`high` - `low`) / 2
>     -   **Step 3.2:** If `p(mid)` is `true`, set `high` = `mid`
>     -   **Step 3.3:** Otherwiese if `p(mid)` is `false`, set `low` = `mid` + 1
> -   **Step 4:** If `p(low)` is `false` return an error as there is no `true` predicate
> -   **Step 5:** Return `low` as the solution

## Implementation

Given below is the generic code implementation to find the minimum value where the predicate results flip from `false` to `true` in a series starting with `false` predicate results. The boundaries of the search spaces are held in `low` and `high`.

To modify the implementation for a series that starts with `true` values and flips to `false` values, we can change `p ( mid )` to `! p ( mid )` to find the minimum value where the predicate result flips to `false`.

C++

```cpp

class Solution {
public:
    int minimumPredicate() {

        int low = 1; // The minimum valid value in the search space
        int high = 1e7; // The maximum valid value in the search space

        // Perform binary search to find the minimum true predicate
        while (low < high) {

            // Find the middle of the current search space
            int mid = low + (high - low) / 2;

            // If the predicate is true at mid, search in the lower half
            if (p(mid)) {
                // Set high to mid as mid might be the minimum true predicate
                high = mid;
            }

            // If the predicate is false at mid, search in the higher half
            else {
                // Since all values less than mid are also false, move low up
                low = mid + 1;
            }

        // After the loop, low should point to the minimum true predicate
        if (!p(low)) {
            return -1; // All inputs are false
        }

        // Return input for the minimum true predicate
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

// Diagram: public int minimumPredicate() {

        int low = 1; // The minimum valid value in the search space
        int high = (int) 1e7; // The maximum valid value in the search space

        // Perform binary search to find the minimum true predicate
        while (low < high) {

            // Find the middle of the current search space
            int mid = low + (high - low) / 2;

            // If the predicate is true at mid, search in the lower half
            if (p(mid)) {
                // Set high to mid as mid might be the minimum true predicate
                high = mid;
            }

            // If the predicate is false at mid, search in the higher half
            else {
                // Since all values less than mid are also false, move low up
                low = mid + 1;
            }

        // After the loop, low should point to the minimum true predicate
        if (!p(low)) {
            return -1; // All inputs are false
        }

        // Return input for the minimum true predicate
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
        System.out.println(sol.firstTruePredicate());
    }
```

Typescript

```typescript
class Solution {
  minimumPredicate(): number {
    let low = 1; // The minimum valid value in the search space
    let high = 1e7; // The maximum valid value in the search space

    // Perform binary search to find the minimum true predicate
    while (low < high) {
      // Find the middle of the current search space
      const mid = low + Math.floor((high - low) / 2);

      // If the predicate is true at mid, search in the lower half
      if (this.p(mid)) {
        // Set high to mid as mid might be the minimum true predicate
        high = mid;
      }

      // If the predicate is false at mid, search in the higher half
      else {
        // Since all values less than mid are also false, move low up
        low = mid + 1;
      }

    // After the loop, low should point to the minimum true predicate
    if (!this.p(low)) {
      return -1; // All inputs are false
    }

    // Return input for the minimum true predicate
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

// Diagram: minimumPredicate() {

    let low = 1; // The minimum valid value in the search space
    let high = 1e7; // The maximum valid value in the search space

    // Perform binary search to find the minimum true predicate
    while (low < high) {

      // Find the middle of the current search space
      let mid = Math.floor(low + (high - low) / 2);

      // If the predicate is true at mid, search in the lower half
      if (this.p(mid)) {
        // Set high to mid as mid might be the minimum true predicate
        high = mid;
      }

      // If the predicate is false at mid, search in the higher half
      else {
        // Since all values less than mid are also false, move low up
        low = mid + 1;
      }

    // After the loop, low should point to the minimum true predicate
    if (!this.p(low)) {
      return -1; // All inputs are false
    }

    // Return input for the minimum true predicate
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
    def minimumPredicate(self) -> int:
        low: int = 1  # The minimum valid value in the search space
        high: int = int(1e7)  # The maximum valid value in the search space

        # Perform binary search to find the minimum true predicate
        while low < high:

            # Find the middle of the current search space
            mid: int = low + (high - low) // 2

            # If the predicate is true at mid, search in the lower half
            if self.p(mid):
                # Set high to mid as mid might be the minimum true predicate
                high = mid

            # If the predicate is false at mid, search in the higher half
            else:
                # Since all values less than mid are also false, move low up
                low = mid + 1

        # After the loop, low should point to the minimum true predicate
        if not self.p(low):
            return -1  # All inputs are false

        # Return input for the minimum true predicate
        return low

    # Example predicate function (to be replaced with actual logic)
    def p(self, x: int) -> bool:
        # Implement your predicate logic here
        return x >= 1000
```

## Complexity Analysis

The algorithm's time and space complexity are easy to understand. We have the two variables `low` and `high` that hold the start and end of the current search space, respectively, and in each iteration, we reduce the size of the search space by half. If we assume that the predicate function p takes constant time and space and the initial size of the problem space is **N**, the time complexity in any case is **O(log(N))**.

Since we don't create only a fixed number of extra variables during the execution of the algorithm, the space complexity **O(1)** is constant in any case.

> **Any case -**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(log(N))**

Later in the course, we will examine techniques for identifying problems that can be solved using the minimum predicate search algorithm and walk through an example to better understand it.

***

# Example | Searching | Codeintuition

// Diagram: Identifying the minimum predicate search pattern

The minimum predicate search algorithm is a generalisation of the binary search algorithm used to find the first (minimum) point in a sorted search space at which a monotonic boolean function (predicate) changes its value, assuming it changes only once. It is a very powerful technique that can solve many optimization and feasibility problems in logarithmic time.

These are generally medium or hard problems where we have a large sorted search space, and we need to define a predicate function that verifies if certain constraints are met. The goal is to find the first (minimum) value in the search space where the result of the predicate function flips.

If the problem statement or its solution follows the generic template below, it can be solved using the minimum predicate search algorithm.

**Template:**

Given a predicate function that results in a monotonic sequence that flips once from `true` to `false` or `false` to `true` over a sorted search space, find the minimum value in the search space where the result flips.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the minimum predicate search algorithm.

> **Problem statement:** Given an array distance of size `n`, where `distance\[i\]` denotes the distance of the `ith` bus ride. You are also given a decimal number of `hours`, representing the minimum time you must reach your house. To reach home, you must take sequential bus rides. Write a function to find and return the minimum speed that all buses must travel at so you can reach home on time. Return `-1` if it's not possible to reach home on time.
>
> **Note:** Each bus can only depart at an integer time, so for e.g. if the 1st bus takes 2.3 hours, you must wait 0.7 hours to take the second bus

// Diagram: Find the minimum speed at which we can reach home within 5.50 hours.

### The minimum predicate search solution

On closely observing the problem, we can see that if we cannot reach home on time for a speed `si` , we will not reach home on time for any speed lower than that. Similarly, if we can reach home on time for a speed `sj` we will reach home on time for any speed greater than that.

// Diagram: For all speeds <= si we can never reach home on time and for all speeds >= sj we will always reach home on time.

And so, there will be a **minimum** speed `S` for and beyond which, we will reach home on time.

// Diagram: The minimum speed S for which we can reach home on time.

We create a function `canReach` that takes as input a `speed` and the given hours before which we must reach home, and returns whether we can reach home on time as `true` or `false`. We initialise a variable, `totalTime`, to 0 and iterate over the `distance` array.

Since a bus can only run at integer hours, in each iteration, we calculate the integer number of hours a bus takes to run at the given `speed` by dividing its distance by `speed` and rounding it up to the nearest integer, where the rounded-up part is the waiting time for the next bus. We do this for every bus except the last one, since it drops us straight at our home and we don't need to wait further. In the end, we return `true` if `totalTime <= hours` ; otherwise, we return `false`.

Below is the execution of the `canReach` function for two different values, one for which we cannot reach home on time and the other for which we can reach home on time.

Given below is a case when we **cannot** reach home on time at the given `speed`.

// Diagram: Find if we can reach home within 5.50 hours at speed 2

Given below is a case when we **can** reach home on time at the given `speed`.

// Diagram: Find if we can reach home within 5.50 hours at speed 20

The results from the `canReach` function over an increasing value of `speed` will be a monotonic series that starts with a `false` value and gradually flips to `true`, depending on the array `distance` and `hours`.

// Diagram: canReach (distance, speed, hour)

We need to find the minimum value of `speed` for which the monotonic function `canReach` flips from `false` to `true`.  This fits the generic template for the minimum predicate search pattern, where `canReach` is the predicate function, and the integer range is the search space for `speed`.

**Template:**Given a predicate function (`canReach`) that results in a monotonic sequence that flips once from `false` to `true` over a sorted search space (1 to maximum valid speed), find the minimum value in the search space where the result flips.

To find the minimum speed at which we can reach our home on time, we initialise two variables, `low` and `high`, with `1` and the maximum integer value, respectively. We iterate until `low < high`, and in each iteration, find the middle of the range in a variable `mid`.

We then check if the function `canReach` returns `true` for `mid`. If it does, it means `mid`  could potentially be the first (minimum) speed at which we can reach home in time, and so set `high = mid` for the next iteration. Otherwise, if `canReach` returns`false`, it means all speeds less than or equal to `mid` will also make us late, and so we set `low = mid + 1` for the next iteration.

At the end of all iterations, when`low`becomes equal to`high` and `low`potentially has the minimum speed at which we can reach home on time. We return it as the minimum speed if `canReach` returns `true` for `low` ; otherwise, we return `-1` as we can't arrive on time at any valid speed.

Below is the execution of the minimum predicate search solution for the problem using the `canReach` function.

In the illustration we initialize `high` with a smaller value instead of integer maximum to reduce the number of iterations for simplicity.

Find the minimum speed at which we can reach home in 5.50 hours.

The implementation of the minimum predicate search solution is given as follows. 

C++

```cpp
#include <cmath>

// Diagram: using namespace std;

class Solution {
public:

    // Predicate: checks if it's possible to reach the destination on
    // time with a given speed
    bool canReachOnTime(vector<int> &distance, double hour, int speed) {
        double totalTime = 0;

        // Calculate the total time required to reach each checkpoint
        for (int i = 0; i < distance.size() - 1; i++) {
            totalTime += ceil(static_cast<double>(distance[i]) / speed);
        }

        // Add the time required to reach the final destination
        totalTime += static_cast<double>(distance.back()) / speed;

        // Check if the total time is less than or equal to the given
        // hour
        return totalTime <= hour;
    }

// Diagram: int punctualArrivalSpeed(vector<int> &distance, double hour) {

        // Initialise the search space for speed with low as 1
        int low = 1;

        // Initialise high to a large value (1e7) as per problem
        // constraints
        int high = 1e7;

        // Perform binary search to find the minimum speed required to
        // reach the destination on time
        while (low < high) {

            // Find the middle speed to check if it is possible to reach
            // the destination on time
            int mid = low + (high - low) / 2;

            // mid is a possible speed, update the result and search
            // for a smaller speed
            if (canReachOnTime(distance, hour, mid)) {

                // Try to find a smaller speed
                high = mid;
            }

            // mid is not a possible speed, search for a larger speed
            else {

                // Try to find a larger speed
                low = mid + 1;
            }

        // After the search, low is the candidate minimum speed
        // Check if it actually works, as it could be possible that no
        // speed allows reaching on time
        if (!canReachOnTime(distance, hour, low)) {
            return -1;
        }

        // Return the minimum speed found
        return low;
    }
};
```

Java

```java
class Solution {

    // Predicate: checks if it's possible to reach the destination on
    // time with a given speed
    private boolean canReachOnTime(
        int[] distance,
        double hour,
        int speed
    ) {
        double totalTime = 0;

        // Calculate the total time required to reach each checkpoint
        for (int i = 0; i < distance.length - 1; i++) {
            totalTime += Math.ceil((double) distance[i] / speed);
        }

        // Add the time required to reach the final destination
        totalTime += (double) distance[distance.length - 1] / speed;

        // Check if the total time is less than or equal to the given
        // hour
        return totalTime <= hour;
    }

// Diagram: public int punctualArrivalSpeed(int[] distance, double hour) {

        // Initialise the search space for speed with low as 1
        int low = 1;

        // Initialise high to a large value (1e7) as per problem
        // constraints
        int high = (int) 1e7;

        // Perform binary search to find the minimum speed required to
        // reach the destination on time
        while (low < high) {

            // Find the middle speed to check if it is possible to reach
            // the destination on time
            int mid = low + (high - low) / 2;

            // mid is a possible speed, update the result and search
            // for a smaller speed
            if (canReachOnTime(distance, hour, mid)) {

                // Try to find a smaller speed
                high = mid;
            }

            // mid is not a possible speed, search for a larger speed
            else {

                // Try to find a larger speed
                low = mid + 1;
            }

        // After the search, low is the candidate minimum speed
        // Check if it actually works, as it could be possible that no
        // speed allows reaching on time
        if (!canReachOnTime(distance, hour, low)) {
            return -1;
        }

        // Return the minimum speed found
        return low;
    }
```

Typescript

```typescript
export class Solution {

    // Predicate: checks if it's possible to reach the destination on
    // time with a given speed
    canReachOnTime(
        distance: number[],
        hour: number,
        speed: number
    ): boolean {
        let totalTime = 0;

        // Calculate the total time required to reach each checkpoint
        for (let i = 0; i < distance.length - 1; i++) {
            totalTime += Math.ceil(distance[i] / speed);
        }

        // Add the time required to reach the final destination
        totalTime += distance[distance.length - 1] / speed;

        // Check if the total time is less than or equal to the given
        // hour
        return totalTime <= hour;
    }

// Diagram: punctualArrivalSpeed(distance: number[], hour: number): number {

        // Initialise the search space for speed with low as 1
        let low = 1;

        // Initialise high to a large value (1e7) as per problem
        // constraints
        let high = 1e7;

        // Perform binary search to find the minimum speed required to
        // reach the destination on time
        while (low < high) {

            // Find the middle speed to check if it is possible to reach
            // the destination on time
            let mid = low + Math.floor((high - low) / 2);

            // mid is a possible speed, update the result and search
            // for a smaller speed
            if (this.canReachOnTime(distance, hour, mid)) {

                // Try to find a smaller speed
                high = mid;
            }

            // mid is not a possible speed, search for a larger speed
            else {

                // Try to find a larger speed
                low = mid + 1;
            }

        // After the search, low is the candidate minimum speed
        // Check if it actually works, as it could be possible that no
        // speed allows reaching on time
        if (!this.canReachOnTime(distance, hour, low)) {
            return -1;
        }

        // Return the minimum speed found
        return low;
    }
```

Javascript

```javascript
export class Solution {

    // Predicate: checks if it's possible to reach the destination on
    // time with a given speed
    canReachOnTime(distance, hour, speed) {
        let totalTime = 0;

        // Calculate the total time required to reach each checkpoint
        for (let i = 0; i < distance.length - 1; i++) {
            totalTime += Math.ceil(distance[i] / speed);
        }

        // Add the time required to reach the final destination
        totalTime += distance[distance.length - 1] / speed;

        // Check if the total time is less than or equal to the given
        // hour
        return totalTime <= hour;
    }

// Diagram: punctualArrivalSpeed(distance, hour) {

        // Initialise the search space for speed with low as 1
        let low = 1;

        // Initialise high to a large value (1e7) as per problem
        // constraints
        let high = 1e7;

        // Perform binary search to find the minimum speed required to
        // reach the destination on time
        while (low < high) {

            // Find the middle speed to check if it is possible to reach
            // the destination on time
            let mid = low + Math.floor((high - low) / 2);

            // mid is a possible speed, update the result and search
            // for a smaller speed
            if (this.canReachOnTime(distance, hour, mid)) {

                // Try to find a smaller speed
                high = mid;
            }

            // mid is not a possible speed, search for a larger speed
            else {

                // Try to find a larger speed
                low = mid + 1;
            }

        // After the search, low is the candidate minimum speed
        // Check if it actually works, as it could be possible that no
        // speed allows reaching on time
        if (!this.canReachOnTime(distance, hour, low)) {
            return -1;
        }

        // Return the minimum speed found
        return low;
    }
```

Python

```python
import math
from typing import List

class Solution:

    # Predicate: checks if it's possible to reach the destination on
    # time with a given speed
    def can_reach_on_time(
        self, distance: List[int], hour: float, speed: int
    ) -> bool:
        total_time = 0

        # Calculate the total time required to reach each checkpoint
        for i in range(len(distance) - 1):
            total_time += math.ceil(distance[i] / speed)

        # Add the time required to reach the final destination
        total_time += distance[-1] / speed

        # Check if the total time is less than or equal to the given hour
        return total_time <= hour

    def punctual_arrival_speed(
        self, distance: List[int], hour: float
    ) -> int:

        # Initialise the search space for speed with low as 1
        low: int = 1

        # Initialise high to a large value (1e7) as per problem
        # constraints
        high: int = int(1e7)

        # Perform binary search to find the minimum speed required to
        # reach the destination on time
        while low < high:

            # Find the middle speed to check if it is possible to reach
            # the destination on time
            mid = low + (high - low) // 2

            # mid is a possible speed, update the result and search
            # for a smaller speed
            if self.can_reach_on_time(distance, hour, mid):

                # Try to find a smaller speed
                high = mid

            # mid is not a possible speed, search for a larger speed
            else:

                # Try to find a larger speed
                low = mid + 1

        # After the search, low is the candidate minimum speed
        # Check if it actually works, as it could be possible that no
        # speed allows reaching on time
        if not self.can_reach_on_time(distance, hour, low):
            return -1

        # Return the minimum speed found
        return low
```

## Example problems

Most problems in this category are **easy** or **medium**; a list of a few is given below.

> -   **[Punctual arrival speed](https://www.codeintuition.io/courses/searching/BBW1lqQsy_CkJayBMckzM)**
> -   **[Penalty with balls](https://www.codeintuition.io/courses/searching/xQ7pAmpG-Up4uHUCd2rS9)**
> -   **[Minimum shipping capacity](https://www.codeintuition.io/courses/searching/ke266Y-PVh5hOSYdfs0gV)**
> -   **[Trip completion frenzy](https://www.codeintuition.io/courses/searching/9FWiQSJuhqx7ps6KgUg9n)**

We will now solve these problems to understand the minimum predicate search pattern better.

***

# Punctual arrival speed

## Problem Statement

Given an array **distance** of size **n**, where `distance[i]` denotes the distance of the `ith` bus ride. You are also given a decimal number of **hours**,representing the minimum time you must reach your house. To reach home, you must take sequential bus rides. Write a function to find and return the minimum speed that all buses must travel at so you can reach home on time. Return `-1` if it's not possible to reach home on time.

Each bus can only depart at an integer time, so for e.g. if the 1st bus takes `2.3` hours, you must wait `0.7` hours to take the second bus

### Example 1

> -   **Input:** distance = \[1, 3, 5\], hours = 2.5
> -   **Output:** 10
> -   **Explanation:** Here is the sequence of events.
> -   The first bus ride takes 1/10 = 0.1 time, now we must wait for 0.9 hours
> -   The second bus ride takes 3/10 = 0.3 time, now we must wait 0.7 hours
> -   The third bus rides takes 5/10 = 0.5 time

### Example 2

> -   **Input:** distance = \[1, 4, 9\], hours = 6
> -   **Output:** 3
> -   **Explanation:** Here is the sequence of events.
> -   The first bus ride takes 1/3 = 0.333 time, now we must wait for 0.667 hours
> -   The second bus ride takes 4/3 = 1.333 time, now we must wait 0.667 hours
> -   The third bus rides takes 9/3 = 3 time

### Example 3

> -   **Input:** distance = \[1, 8, 10\], hours = 2
> -   **Output:** -1
> -   **Explanation:** It is impossible as the earliest train can depart is at the 2-hour mark.

## Solution

```cpp
#include <cmath>

using namespace std;

class Solution {
public:

    // Predicate: checks if it's possible to reach the destination on
    // time with a given speed
    bool canReachOnTime(vector<int> &distance, double hour, int speed) {
        double totalTime = 0;

        // Calculate the total time required to reach each checkpoint
        for (int i = 0; i < distance.size() - 1; i++) {
            totalTime += ceil(static_cast<double>(distance[i]) / speed);
        }

        // Add the time required to reach the final destination
        totalTime += static_cast<double>(distance.back()) / speed;

        // Check if the total time is less than or equal to the given
        // hour
        return totalTime <= hour;
    }

    int punctualArrivalSpeed(vector<int> &distance, double hour) {

        // Initialise the search space for speed with low as 1
        int low = 1;

        // Initialise high to a large value (1e7) as per problem
        // constraints
        int high = 1e7;

        // Perform binary search to find the minimum speed required to
        // reach the destination on time
        while (low < high) {

            // Find the middle speed to check if it is possible to reach
            // the destination on time
            int mid = low + (high - low) / 2;

            // mid is a possible speed, update the result and search
            // for a smaller speed
            if (canReachOnTime(distance, hour, mid)) {

                // Try to find a smaller speed
                high = mid;
            }

            // mid is not a possible speed, search for a larger speed
            else {

                // Try to find a larger speed
                low = mid + 1;
            }
        }

        // After the search, low is the candidate minimum speed
        // Check if it actually works, as it could be possible that no
        // speed allows reaching on time
        if (!canReachOnTime(distance, hour, low)) {
            return -1;
        }

        // Return the minimum speed found
        return low;
    }
};
```

***

# Penalty with balls

## Problem Statement

You are given an array **bags**, where `bags[i]` denotes the number of balls in the `ith` bag and an integer **maxOperations**. In each operation, you can divide any of the bags into two bags, each containing a non-zero number of balls, or not divide them at all. You can do this operation at almost maxOperation times. Your penalty is the maximum number of balls in a bag. Write a function to find and return the **minimum** possible penalty after you perform all the operations.

### Example 1

> -   **Input:** bags = \[9, 7, 6\], maxOperations = 3
> -   **Output:** 5
> -   **Explanation:** Below are the steps involved:
> -   Divide the first bag into two bags, one with 5 and the other with 4 balls.
> -   Divide the second bag into two bags, one with 4 and the other with 3 balls.
> -   Divide the third bag into two bags, both with 3 balls each.

### Example 2

> -   **Input:** bags = \[4, 8\], maxOperations = 1
> -   **Output:** 4
> -   **Explanation:** Below are the steps involved:
> -   Divide the second bag into two bags, both with 4 balls each.

### Example 3

> -   **Input:** bags = \[4, 2\], maxOperations = 4
> -   **Output:** 1
> -   **Explanation:** Below are the steps involved:
> -   Divide the first bag into two bags, both with 2 balls each.
> -   Divide all the remaining three bags into bags of size 1 each (3 operations).

## Solution

```cpp
#include <algorithm>
#include <cmath>

using namespace std;

class Solution {
public:

    // Predicate: checks if it's possible to achieve a given penalty
    // (max number of balls in any bag)
    bool canAchievePenalty(
        vector<int> &bags,
        int maxOperations,
        int penalty
    ) {
        int operations = 0;
        for (int balls : bags) {

            // If a bag has more than 'penalty' balls, we need to split
            // it. The number of splits required for a bag with 'balls'
            // is (balls - 1) / penalty
            if (balls > penalty) {

                // This is the number of splits required
                operations += (balls - 1) / penalty;
            }
        }

        // Check if we can do the splits within maxOperations
        return operations <= maxOperations;
    }

    int penaltyWithBalls(vector<int> &bags, int maxOperations) {

        // The minimum penalty is at least 1 ball in a bag
        int low = 1;

        // The maximum penalty is the maximum number of balls in a
        // single bag
        int high = *max_element(bags.begin(), bags.end());

        while (low < high) {

            // Calculate the middle penalty
            int mid = low + (high - low) / 2;

            // If we can achieve this penalty, this is a potential answer
            // so try to find a smaller one
            if (canAchievePenalty(bags, maxOperations, mid)) {

                // Try a smaller penalty
                high = mid;
            }

            // If we can't achieve this penalty, try a larger one
            else {

                // Try a larger penalty
                low = mid + 1;
            }
        }

        // After the search, low is the minimum penalty achievable
        return low;
    }
};
```

***

# Minimum shipping capacity

## Problem Statement

You are given an array **weights**, where `weights[i]` denotes the weight of the `i-th` package, and an integer **days**. You have a ship that can carry packages in the order they appear in the array. Each day, the ship can carry one or more packages as long as the total weight does not exceed its capacity. Your task is to find and return the minimum ship capacity required to transport all the packages within the specified time frame.

### Example 1

> -   **Input:** weights = \[20, 10, 25, 35\], days = 3
> -   **Output:** 35
> -   **Explanation:** Below are the steps involved:
> -   Day 1: Ship packages \[20, 10\] → total 30 (within capacity 35).
> -   Day 2: Ship package \[25\] → total 25 (within capacity 35).
> -   Day 3: Ship package \[35\] → total (within capacity 35).

### Example 2

> -   **Input:** weights = \[20, 10, 40, 30\], days = 3
> -   **Output:** 40
> -   **Explanation:** Below are the steps involved:
> -   Day 1: Ship packages \[20, 10\] → total 30 (within capacity 40).
> -   Day 2: Ship package \[40\] → total 40 (within capacity 40).
> -   Day 3: Ship package \[30\] → total 30 (within capacity 40).

### Example 3

> -   **Input:** weights = \[6, 3, 9\], days = 3
> -   **Output:** 18
> -   **Explanation:** Below are the steps involved:
> -   Day 1: Ship packages \[6, 3, 9\] → total 18 (within capacity 18).

## Solution

```cpp
using namespace std;

class Solution {
public:
    int minimumShippingCapacity(vector<int> &weights, int days) {

    }
};
```

***

# Trip completion frenzy

## Problem Statement

Given an array of non-negative integer **times**, where `times[i]` denotes the time a plane takes to complete a trip. Each plane can pick up another trip as soon as it finishes one trip, i.e., each of the planes operates independently and is not influenced by other planes. You are also given an integer **totalTrips**, write a function to find and return the minimum time required to complete all the trips using the planes at your disposal.

### Example 1

> -   **Input:** times = \[3, 4, 5\], totalTrips= 4
> -   **Output:** 6
> -   **Explanation:** Below are the trips completed by the planes at each time interval: t1 = \[0, 0, 0\] t2 = \[0, 0, 0\] t3 = \[1, 0, 0\] t4 = \[1, 1, 0\] t5 = \[1, 1, 1\] t6 = \[2, 1, 1\]

### Example 2

> -   **Input:** times = \[1, 2, 3\], totalTrips= 5
> -   **Output:** 3
> -   **Explanation:** Below are the trips completed by the planes at each time interval: t1 = \[1, 0, 0\] t2 = \[2, 1, 0\] t3 = \[3, 1, 1\]

### Example 3

> -   **Input:** times = \[1\], totalTrips= 5
> -   **Output:** 5
> -   **Explanation:** Below are the trips completed by the planes at each time interval: t1 = \[1\] t2 = \[2\] t3 = \[3\] t4 = \[4\] t5 = \[5\]

## Solution

```cpp
#include <algorithm>

using namespace std;

class Solution {
public:

    // Predicate: checks if it's possible to complete at least
    // 'totalTrips' in 'time' time
    bool canCompleteTrips(vector<int> &times, int totalTrips, int time) {
        int tripsCompleted = 0;
        for (int t : times) {

            // Calculate how many trips each plane can complete in 'time'
            tripsCompleted += time / t;
        }

        // Check if the total trips are enough
        return tripsCompleted >= totalTrips;
    }

    int tripCompletionFrenzy(vector<int> &times, int totalTrips) {

        // The minimum time required is 0
        int low = 0;

        // The high boundary is the maximum time taken by any plane
        int high = *max_element(times.begin(), times.end()) * totalTrips;

        while (low < high) {

            // Calculate the middle time
            int mid = low + (high - low) / 2;

            // If we can complete the trips in 'mid' time, try for
            // smaller time
            if (canCompleteTrips(times, totalTrips, mid)) {

                // Try a smaller time
                high = mid;
            }

            // If we can't complete the trips, try larger time
            else {

                // Try a larger time
                low = mid + 1;
            }
        }

        // After the search, low is the minimum time required
        return low;
    }
};
```
