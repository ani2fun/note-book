# Understanding the 0/1 knapsack problem

In many applications, software must choose between several competing options while operating under limited resources such as time, memory, or computational capacity. Each option provides some benefit, but selecting it consumes part of the available budget and may prevent other options from being chosen. The goal, therefore, is to determine which combination of options produces the greatest overall value without exceeding the given constraint.

A fundamental problem in this space is the 0/1 knapsack problem, where the "0/1" indicates that each item must be either included entirely or left out entirely; no partial items are allowed.

// Diagram: The 0/1 knapsack problem.

The 0/1 knapsack problem is a foundational problem in dynamic programming and appears frequently in applications such as portfolio optimization, resource allocation in computing systems, cargo loading, budget planning, and project selection.

In this lesson, we will learn about the 0/1 knapsack problem and how it can be solved efficiently using a dynamic programming solution.

## The 0/1 knapsack problem

Consider we are given `n` items, where the item at index `i` has a weight `weights[i]` and a value `values[i]`. We also have a knapsack with a maximum weight capacity `capacity`. Each item can either be included in the knapsack or excluded; we cannot take a fraction of an item.

// Diagram: We are given n items with weights and corresponding values, and we have a fixed capacity for the knapsack.

We need to find the maximum total value we can achieve by selecting a subset of items such that their total weight does not exceed `capacity`.

// Diagram: We need to find the maximum total value we can achieve.

## Optimal substructure

It is easy to prove that the optimal solution to the 0/1 knapsack problem can be constructed from optimal solutions to its smaller subproblems. It is important to observe that when we consider items `0` through `i` and a knapsack with capacity `c`, we have a clear choice to make regarding the item at index `i`.

If for item at index `i`, its weight `weights[i]` is greater than the available capacity `c`, we have no choice but to exclude it and work with items `0` through `i - 1` using the full capacity `c`.

// Diagram: If the weight of the item at index i is greater than c, we cannot choose that item.

However, if for the item at index `i` its weight `weights[i]` is less than or equal to the available capacity `c`, we have the following two choices.

1.  1We can include the item at index `i` in our knapsack and gain its value `values[i]` but consume capacity `weights[i]`, leaving us with a remaining capacity of `c - weights[i]` for items `0` through `i - 1`.
2.  2We can exclude the item at index `i` and maintain the full capacity `c` but can only use items `0` through `i - 1` to build our solution.

The optimal solution between these choices is the one that results in greater total value for items `0` through `i` and capacity `c`.

// Diagram: If the weight of the ith item is less than or equal to c, we have two choices and the optimal choice is one with the maximum value.

Based on the above, it is clear that to find the maximum value achievable with items `0` through `i` and capacity `c`, we have two options to choose from:

1.  1If `weights[i]` is greater than `c`, we must exclude item `i`, and the solution is the maximum value achievable with items `0` through `i - 1` and capacity `c`.
2.  2If `weights[i]` does not exceed `c`, we take the maximum of the two options: including item `i` (gaining `values[i]` and reducing capacity to `c - weights[i]`) or excluding item `i` (keeping the full capacity `c`). Both options then solve for items `0` through `i - 1`.

The solution to the problem depends on the optimal solution of these smaller subproblems.

// Diagram: The optimal solution to the problem depends on the optimal solution to the smaller subproblems.

Note that the subproblems are uniquely identified by two dimensions: the index `i` of the last item under consideration and the remaining capacity `c`.

Based on the optimal substructure above, we can define the relationship between the problem and its subproblems. We can define a function `knapsack(i, c)` that returns the maximum value achievable using items `0` through `i` with a knapsack capacity of `c`.

// Diagram: Define a function knapsack to find the maximum value achievable when considering items \[0...i\] with a capacity of c

The recurrence relation breaks the problem into smaller subproblems by reducing `i` by one at each step. This reduction eventually reaches the point where `i` drops below `0`. When `i` is less than `0`, there are no items left to consider, so no value can be achieved and `knapsack` returns `0`. Additionally, when `c` is `0`, the knapsack has no remaining capacity, so no items can be added regardless of `i`, and `knapsack` returns `0`. These serve as the base cases of the recurrence relation, terminating the recursion.

**Why does the base case use `i < 0` instead of `i == 0`?** 

Since `i` is an index into the items, the value `i == 0` represents the state where we are considering item `0`, which is still a valid item that can potentially be included. Only when `i` drops below `0` have we truly exhausted all items.

// Diagram: The base case for the 0/1 knapsack problem.

To get the solution for `knapsack(i, c)`, we check whether `weights[i]` exceeds `c`. If the item is too heavy, we cannot include it, so the solution is `knapsack(i - 1, c)`. If the item fits, we take the maximum of two choices: `values[i] + knapsack(i - 1, c - weights[i])`, representing the inclusion of item `i`, or `knapsack(i - 1, c)`, representing the exclusion of item `i`.

The recurrence relation below expresses the solution to the problem as a function of solutions to smaller problems. The solution to the original problem is `knapsack(n - 1, capacity)` where `n` is the number of items and `capacity` is the knapsack capacity.

// Diagram: The recurrence relation for the 0/1 knapsack problem.

## Overlapping Subproblems

It is easy to see that there are many overlapping subproblems in the recurrence relation to solve the 0/1 knapsack problem. To compute `knapsack(i, c)`, we may recursively compute `knapsack(i - 1, c - weights[i])` when including item `i`, or `knapsack(i - 1, c)` when excluding it.

// Diagram: There are many overlapping subproblems when finding the solution to a problem state.

Conversely, the subproblem `knapsack(i, c)` appears in the computation of `knapsack(i + 1, c)` when item `i + 1` is excluded, and potentially in `knapsack(i + 1, c + weights[i + 1])` when item `i + 1` is included, since including item `i + 1` with capacity `c + weights[i + 1]` reduces the remaining capacity to `c`, reaching the same subproblem.

// Diagram: A problem state may appear as a subproblem in many other problem states.

**When does significant overlap actually occur?** 

Overlap is most pronounced when multiple items have similar weights. For example, if items `3` and `4` both have weight `5` and the current capacity is `10`, then both `knapsack(2, 5)` (from including item `3`) and `knapsack(3, 5)` (from including item `4`) will eventually reach many of the same subproblems for items `0` through `2`.

A naïve recursive backtracking approach ends up solving the same subproblems multiple times when they are encountered through different recursive branches, leading to very poor performance. Since these overlapping subproblems exist, the problem can be solved much more efficiently using dynamic programming, either through a top-down approach with memoization or a bottom-up approach that builds solutions starting from the base cases.

***

# Understanding the top-down solution to the 0/1 knapsack problem

To solve the 0/1 knapsack problem using a top-down dynamic programming approach, we translate the recurrence relation into a recursive function and use a memoization table to store results of subproblems that have already been solved.

## The top down solution

As with any top-down solution, there is a recursive function that solves subproblems and a calling function that initializes the required data structures and triggers the computation. For the 0/1 knapsack, we define a single recursive function `knapsack` and a calling function that invokes it for the last item and the full capacity.

### The knapsack function

The function `knapsack()` takes as input an index `i` into the items, the remaining capacity `c`, references to the `weights` and `values` arrays, and a reference to the memoization array `memo`. The function returns the maximum value achievable using items `0` through `i` with the given remaining capacity `c`.

// Diagram: Create a function knapsack to return the maximum value achievable from items \[0...i\] with capacity c.

The `memo` array has dimensions `n × (capacity + 1)` where `n` is the number of items and `capacity` is the total knapsack capacity, and is initialized with `-1` in the calling function, where `-1` indicates that the state has not yet been computed. Any non-negative value represents the computed maximum achievable value for that state.

// Diagram: The memo array has a size n x (capacity + 1) and is initalized with -1.

When `knapsack()` is called, we first handle the base cases. If `c` equals `0`, no capacity remains and no more value can be added, so we return `0`. If `i` is less than `0`, there are no items left to consider, so we return `0`.

**Why is the base case `i < 0` instead of `i == 0`?** 

Since `i` is an index into the items, the value `i == 0` represents the state where we are considering item `0`, which is still a valid item. Only when `i` drops below `0` have we truly exhausted all items. This is the same reasoning that applies in the LCS problem where `i == 0` still represents a prefix containing one character.

**Why are there two separate base cases?** 

The case `c == 0` means the knapsack is full even if items remain, none can be added. The case `i < 0` means all items have been considered even if capacity remains, there is nothing left to put in. Either condition alone is sufficient to terminate, so we check both.

// Diagram: If i < 0 or c == 0, the solution is 0, and this serves as the base case.

Before making any recursive calls, we check the `memo` array to see if the solution to the current problem state has already been computed. If `memo[i][c]` is not `-1`, it means the result for this state has already been computed, and we return it directly.

// Diagram: If memo\[i\]\[c\] is not -1, it means the solution to that subproblem is already computed and can be returned to the caller.

If the state`(i, c)`has not been computed, we evaluate the recurrence relation. Since every item can either be excluded or included at most one time, we have two choices at every state.

We can either **exclude**the current item by recursively calling`knapsack(i - 1, c)`, moving on to the remaining items with the same capacity.

// Diagram: Exclude the item and find the maximum value that can be obtained with the remaining items and the remaining capacity.

If `weights[i] <= c`, we can include one copy of the current item, which contributes `values[i]` and reduces the capacity by `weights[i]`. We then solve the problem for the remaining items ( 0 through i-1 ) with the remaining capacity by recursively calling `knapsack(i-1, c - weights[i])`.

// Diagram: Include the item and find the maximum value that can be obtained with the remaining items and the remaining capacity.

We set `memo[i][c]` to the **maximum** of the exclude and include values and return it. If the weight of item `i` exceeds the remaining capacity `c`, we can only exclude it, so we set `memo[i][c]` to the exclude result and return it.

**Why do we take the maximum and not the minimum?** 

The knapsack problem asks us to **maximize** total value. When we have two valid choices: include or exclude,  we pick whichever yields the higher value. This is in contrast to problems like edit distance where we **minimize** cost and take the minimum instead.

// Diagram: Set the solution for state (i, c) in memo\[i\]\[c\] as the maximum of include and exclude choices.

The execution of the `knapsack` function is given below.

// Diagram: Top-down solution to the 0/1 Knapsack with capacity 4

### The calling function

In the calling function, we first create a memoization array `memo` of dimensions `n × (capacity + 1)` where `n` is the number of items and `capacity` is the total knapsack capacity, initialized with all entries set to `-1`.

// Diagram: We create a 2D memo array of size n x (capacity+1) and initialize it with -1.

We then call the recursive function `knapsack` with `i = n - 1` and `c = capacity` to solve for all items and the full capacity. The value returned by this call is the maximum value achievable.

// Diagram: We call the knapsack function passing it n-1, capacity, weights, values and memo to get the solution to the problem.

## Algorithm

The steps below summarise the dynamic programming algorithm to solve the 0/1 knapsack problem using a top-down approach.

> **knapsack(i, c, \[ref\] weights, \[ref\] values, \[ref\] memo):**
>
> -   **Step 1:** If \`c == 0\` or \`i < 0\`, return \`0\`
> -   **Step 2:** If \`memo\[i\]\[c\] != -1\`, return \`memo\[i\]\[c\]\`
> -   **Step 3:** Set \`memo\[i\]\[c\]\` to the return value of call to \`knapsack(i - 1, c, weights, values, memo)\`
> -   **Step 4:** If \`weights\[i\] <= c\`:
>     -   **Step 4.1:** Set \`include\` to \`values\[i\]\` plus the return value of call to \`knapsack(i - 1, c - weights\[i\], weights, values, memo)\`
>     -   **Step 4.2:** Set \`memo\[i\]\[c\]\` to the maximum of \`memo\[i\]\[c\]\` and \`include\`
> -   **Step 5:** Return \`memo\[i\]\[c\]\`
>
> **callingFunction(\[ref\] weights, \[ref\] values, capacity):**
>
> -   **Step 1:** Initialize a variable \`n\` with the size of \`weights\`
> -   **Step 2:** Create a 2D array \`memo\` of size \`n x (capacity + 1)\` and initialize it to \`-1\`
> -   **Step 3:** Return the return value of call to \`knapsack(n - 1, capacity, weights, values, memo)\`

## Implementation

The top-down dynamic programming solution to the problem using memoization is given below.

C++

```cpp
#include <vector>
#include <algorithm>

// Diagram: using namespace std;

class Solution {
private:
    int knapsack(int i,
                 int c,
                 vector<int>& weights,
                 vector<int>& values,
                 vector<vector<int>>& memo) {

        // Base case: no capacity or no items left
        if (c == 0 || i < 0) return 0;

        // Return cached result if already computed
        if (memo[i][c] != -1) {
            return memo[i][c];
        }

        // Option 1: Exclude the current item
        int exclude = knapsack(i - 1, c, weights, values, memo);

        // Option 2: Include the current item if it fits
        if (weights[i] <= c) {
            int include = values[i] +
                         knapsack(i - 1, c - weights[i], weights, values, memo);

            // Store the best of including or excluding
            memo[i][c] = max(exclude, include);
            return memo[i][c];
        }

        // If item cannot be included, store the exclude result
        memo[i][c] = exclude;
        return exclude;
    }

public:
    int callingFunction(vector<int>& weights, vector<int>& values, int capacity) {

// Diagram: int n = weights.size();

        // memo[i][c] stores the maximum value using items 0..i with capacity c
        // initialized to -1 to indicate "not yet computed"
        vector<vector<int>> memo(n, vector<int>(capacity + 1, -1));

        // Start recursion from the last item and full capacity
        return knapsack(n - 1, capacity, weights, values, memo);
    }
};
```

Java

```java
import java.util.Arrays;

// Diagram: class Solution {

    private int knapsack(int i,
                         int c,
                         int[] weights,
                         int[] values,
                         int[][] memo) {

        // Base case: no capacity or no items left
        if (c == 0 || i < 0) return 0;

        // Return cached result if already computed
        if (memo[i][c] != -1) {
            return memo[i][c];
        }

        // Option 1: Exclude the current item
        int exclude = knapsack(i - 1, c, weights, values, memo);

        // Option 2: Include the current item if it fits
        if (weights[i] <= c) {
            int include = values[i] +
                         knapsack(i - 1, c - weights[i], weights, values, memo);

            // Store the best of including or excluding
            memo[i][c] = Math.max(exclude, include);
            return memo[i][c];
        }

        // If item cannot be included, store the exclude result
        memo[i][c] = exclude;
        return exclude;
    }

// Diagram: public int callingFunction(int[] weights, int[] values, int capacity) {

// Diagram: int n = weights.length;

        // memo[i][c] stores the maximum value using items 0..i with capacity c
        // initialized to -1 to indicate "not yet computed"
        int[][] memo = new int[n][capacity + 1];
        for (int[] row : memo) {
            Arrays.fill(row, -1);
        }

        // Start recursion from the last item and full capacity
        return knapsack(n - 1, capacity, weights, values, memo);
    }
```

Python

```python
from typing import List

class Solution:

    def _knapsack(
        self,
        i: int,
        c: int,
        weights: List[int],
        values: List[int],
        memo: List[List[int]]
    ) -> int:

        # Base case: no capacity or no items left
        if c == 0 or i < 0:
            return 0

        # Return cached result if already computed
        if memo[i][c] != -1:
            return memo[i][c]

        # Option 1: Exclude the current item
        exclude: int = self._knapsack(i - 1, c, weights, values, memo)
```

## Complexity analysis

The total number of distinct subproblems in the top-down solution is determined by the number of valid `(i, c)` pairs where `i` ranges from `0` to `n - 1` and `c` ranges from `0` to `capacity`. This gives us at most `n × (capacity + 1)` unique subproblems, each computed at most once due to memoization.

In the worst case, every valid state `(i, c)` must be computed exactly once. This happens when all items have small weights relative to the capacity, and all combinations must be examined before determining the optimal solution. For instance, if all items have weight `1` and the capacity is at least `n`, nearly every state in the table will be visited and computed, leading to a time complexity of **O(N × capacity)**.

// Diagram: In the worst case, all the subproblems are computed.

// Diagram: If all weights are greater than capacity, then only a linear path memo\[\]\[capacity\] is traced, leading to a linear O(N) time.

However, since we create and initialize the memoization array of size `n × (capacity + 1)` in the calling function, the overall time complexity is **O(N × capacity)** in any case.

// Diagram: The time complexity is O(N x capacity) in any case.

Since we create one memoization array `memo` of size `n × (capacity + 1)` where `n` is the number of items and `capacity` is the knapsack capacity, the space complexity in any case is **O(N × capacity)**.

// Diagram: The space complexity is O(N x capacity) in any case.

> **Any Case:**
>
> -   Space Complexity - **O(N × capacity)**
> -   Time Complexity - **O(N × capacity)**

***

# Zero one knapsack

## Problem Statement

You are given two arrays **weights** and **profits** of size N where `weights[i]` denotes the weight of the `ith` item and `profits[i]` denotes the profit you will earn if you steal the `ith` item. You are also given a positive integer **capacity** that denotes the total weight your knapsack can hold. Write a function to find and return the maximum profit you can earn by stealing from these N items such that they fit in your knapsack.

### Example 1

> -   **Input:** weights = \[6, 4, 5, 3\], profits = \[7, 3, 2, 6\], capacity = 10
> -   **Output:** 13
> -   **Explanation:** We can only pick the first and the last item as they give us the maximum profit.

### Example 2

> -   **Input:** weights = \[4, 5, 1\], profits = \[1, 2, 3\], capacity = 4
> -   **Output:** 3
> -   **Explanation:** We can only pick the last item as this is the only one that will fit in our knapsack.

### Example 3

> -   **Input:** weights = \[4, 5, 6\], profits = \[1, 2, 3\], capacity = 3
> -   **Output:** 0
> -   **Explanation:** We cannot fit any item into the knapsack.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int zeroOneKnapsack(
        vector<int> &weights,
        vector<int> &profits,
        int capacity
    ) {
        int n = weights.size();

        // Create a 2D DP array to store the maximum profit at each
        // capacity for different items
        vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));

        // Iterate through each item
        for (int i = 1; i <= n; i++) {

            // Iterate through each capacity from 1 to the total capacity
            for (int w = 1; w <= capacity; w++) {

                // If the weight of the current item is less than or
                // equal to the current capacity
                if (weights[i - 1] <= w) {

                    // Include the current item and calculate the maximum
                    // profit by considering the remaining capacity and
                    // previous items' profits
                    dp[i][w] =
                        max(profits[i - 1] +
                                dp[i - 1][w - weights[i - 1]],
                            dp[i - 1][w]);
                } else {

                    // If the weight of the current item is greater than
                    // the current capacity, skip including the item and
                    // carry forward the previous maximum profit
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }

        // Return the maximum profit obtained
        return dp[n][capacity];
    }
};
```

***

# Zero one Knapsack II

## Problem Statement

You are given two arrays **weights** and **profits** of size N where `weights[i]` denotes the weight of the `ith` item and `profits[i]` denotes the profit you will earn if you steal the `ith` item. You are also given a positive integer **capacity** that denotes the total weight your knapsack can hold. Write a function to find and return a list containing the indexes of items that you will steal to achieve maximum profit while ensuring that they fit in your knapsack. The list of indexes should be in sorted order.

### Example 1

> -   **Input:** weights = \[6, 4, 5, 3\], profits = \[7, 3, 2, 6\], capacity = 10
> -   **Output:** \[0, 3\]
> -   **Explanation:** We can only pick the first and the last item as they give us the maximum profit of 13.

### Example 2

> -   **Input:** weights = \[4, 5, 1\], profits = \[1, 2, 3\], capacity = 4
> -   **Output:** \[2\]
> -   **Explanation:** We can only pick the last item as this is the only one that will fit in our knapsack. This will give us a profit of 3.

### Example 3

> -   **Input:** weights = \[4, 5, 6\], profits = \[1, 2, 3\], capacity = 3
> -   **Output:** \[\]
> -   **Explanation:** We cannot fit any item into the knapsack.

## Solution

```cpp
using namespace std;

class Solution {
public:
    vector<int> zeroOneKnapsackII(
        vector<int> &weights,
        vector<int> &profits,
        int capacity
    ) {
        int n = weights.size();

        // Create a 2D DP array to store the maximum profit at each
        // capacity for different items
        vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));

        // Iterate through each item
        for (int i = 1; i <= n; i++) {

            // Iterate through each capacity from 1 to the total capacity
            for (int w = 1; w <= capacity; w++) {

                // If the weight     of the current item is less than or
                // equal to the current capacity
                if (weights[i - 1] <= w) {

                    // Include the current item and calculate the maximum
                    // profit by considering the remaining capacity and
                    // previous items' profits
                    dp[i][w] =
                        max(profits[i - 1] +
                                dp[i - 1][w - weights[i - 1]],
                            dp[i - 1][w]);
                } else {

                    // If the weight of the current item is greater than
                    // the current capacity, skip including the item and
                    // carry forward the previous maximum profit
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }

        // Track the selected items that contribute to the maximum profit
        vector<int> selectedItems;
        int i = n;
        int w = capacity;

        // Starting from the last item and capacity, backtrack to find
        // the selected items
        while (i > 0 && w > 0) {

            // If the current item was included in the optimal solution,
            // add it to the selected items and reduce the remaining
            // capacity
            if (dp[i][w] != dp[i - 1][w]) {
                selectedItems.push_back(i - 1);
                w -= weights[i - 1];
            }

            // Move to the previous item
            i--;
        }

        // Reverse the selected items to get them in the correct order
        reverse(selectedItems.begin(), selectedItems.end());

        // Return the selected items;
        return selectedItems;
    }
};
```

***

# Understanding the unbounded knapsack problem

Unlike the 0/1 knapsack problem, many real-world optimization problems allow the same option to be used an unlimited number of times rather than restricting each choice to a single use. In these situations, the decision is not simply whether to include an option or not, but how many times it should be chosen while still respecting the overall capacity constraints. Each option has an associated cost and value, and the objective is to determine the combination that maximizes total value without exceeding the available capacity.

A fundamental problem in this space is the unbounded knapsack problem, where "unbounded" means that each item can be included an unlimited number of times.

// Diagram: The unbounded knapsack problem.

The unbounded knapsack problem extends beyond simple one-time selections and proves essential in scenarios like currency denomination (making change with unlimited coins of each type), rod cutting problems (cutting rods or materials where the same length can be cut repeatedly), production planning (manufacturing items with unlimited raw materials), and resource allocation where the same type of resource can be deployed multiple times.

In this lesson, we will learn about the unbounded knapsack problem and how it can be solved efficiently using a dynamic programming solution.

## The unbounded knapsack problem

Consider we are given `n` types of items, where the item at index `i` has a weight `weights[i]` and a value `values[i]`. We also have a knapsack with a maximum weight capacity `capacity`. Unlike the 0/1 variant, each item can be included zero, one, or multiple times in the knapsack.

// Diagram: We are given n items with weights and corresponding values, and we have a fixed capacity for the knapsack.

We need to find the maximum total value we can achieve by selecting items (with repetition allowed) such that their total weight does not exceed `capacity`.

// Diagram: We need to find the maximum total value we can achieve.

## Optimal substructure

It is easy to prove that the optimal solution to the unbounded knapsack problem can be constructed from optimal solutions to its smaller subproblems. It is important to observe that when we consider items `0` through `i` and a knapsack with capacity `c`, we have multiple choices to make regarding the item at index `i`.

If for the item at index `i`, its weight `weights[i]` is greater than the available capacity `c`, we have no choice but to exclude it and work with items `0` through `i - 1` using the full capacity `c`.

// Diagram: If the weight of the item at index i is greater than c, we cannot choose that item.

However, if for the item at index `i` its weight `weights[i]` is less than or equal to the available capacity `c`, we have the following two choices.

1.  1We can include the item at index `i` in our knapsack and gain its value `values[i]` but consume capacity `weights[i]`, leaving us with a remaining capacity of `c - weights[i]`. Since we can use every item an unlimited number of times, we can use the remaining capacity `c - weights[i]` to again choose from items `0` through `i` ( item `i` remains available for selection).
2.  2We can exclude the item at index `i` and maintain the full capacity `c` but can only use items `0` through `i - 1` to build our solution. This permanently removes item `i` from consideration.

The optimal solution between these choices is the one that results in greater total value for items `0` through `i` and capacity `c`.

// Diagram: \[0...i\] items

**How does the include branch differ from the 0/1 knapsack?** 

In the 0/1 knapsack, including item at the index `i` moves us to items `0` through `i - 1`, the item at the index `i` is used up and cannot be chosen again. In the unbounded knapsack, including item at the index `i` keeps us at items `0` through `i` i.e. the item at index `i` remains available because we have unlimited copies. This single difference in the recurrence is what makes the problem "unbounded."

Based on the above, it is clear that to find the maximum value achievable with items `0` through `i` and capacity `c`, we have two options to choose from:

1.  1If `weights[i]` is greater than `c`, we must exclude the item at index `i`, and the solution is the maximum value achievable with items `0` through `i - 1` and capacity `c`.
2.  2If `weights[i]` does not exceed `c`, we take the maximum of the two options: including the item at index `i` (gaining `values[i]`, reducing capacity to `c - weights[i]`, and keeping item `i` available) or excluding item at index `i` (keeping the full capacity `c` but moving to items `0` through `i - 1`).

The solution to the problem depends on the optimal solution of these smaller subproblems.

// Diagram: The optimal solution to the problem depends on the optimal solution to the smaller subproblems.

Note that the subproblems are uniquely identified by two dimensions: the index `i` of the last item under consideration and the remaining capacity `c`.

**Why does excluding the item at index `i` move to items `0` through `i - 1` rather than keeping item `i` available?** 

When we exclude the item at index `i`, we are deciding that it will not be used at all (not even once). If we kept it available after excluding it, we would re-encounter the same decision at the same state `(i, c)`, leading to infinite recursion. By moving to `i - 1`, we permanently remove the item at index `i` from future consideration and make progress toward the base case.

Based on the optimal substructure above, we can define the relationship between the problem and its subproblems. We can define a function `knapsack(i, c)` that returns the maximum value achievable using items `0` through `i` with a knapsack capacity of `c`.

// Diagram: Define a function knapsack to find the maximum value achievable when considering items \[0...i\] with a capacity of c

The recurrence relation breaks the problem into smaller subproblems by either reducing `i` by one (exclude) or reducing `c` by `weights[i]` (include). This reduction eventually reaches the point where either `i` drops below `0` or `c` reaches `0`. When `i` is less than `0`, there are no items left to consider, so no value can be achieved and `knapsack` returns `0`. When `c` is `0`, the knapsack has no remaining capacity, so no items can be added regardless of `i`, and `knapsack` returns `0`. These serve as the base cases of the recurrence relation, terminating the recursion.

**Why does the base case use `i < 0` instead of `i == 0`?** 

Since `i` is an index into the items, the value `i == 0` represents the state where we are considering the item at index `0`, which is still a valid item that can potentially be included. Only when `i` drops below `0` have we truly exhausted all items.

// Diagram: The base case for the unbounded knapsack problem.

To get the solution for `knapsack(i, c)`, we check whether `weights[i]` exceeds `c`. If the item is too heavy, we cannot include it, so the solution is `knapsack(i - 1, c)`. If the item fits, we take the maximum of two choices: `values[i] + knapsack(i, c - weights[i])`, representing the inclusion of the item at index `i` (keeping it available for future use), or `knapsack(i - 1, c)`, representing the exclusion of the item at index `i`.

The recurrence relation below expresses the solution to the problem as a function of solutions to smaller problems. The solution to the original problem is `knapsack(n - 1, capacity)` where `n` is the number of items and `capacity` is the knapsack capacity.

// Diagram: The recurrence relation for the unbounded knapsack problem.

## Overlapping Subproblems

It is easy to see that there are many overlapping subproblems in the recurrence relation to solve the unbounded knapsack problem. To compute `knapsack(i, c)`, we may recursively compute `knapsack(i, c - weights[i])` when including the item at index `i`, or `knapsack(i - 1, c)` when excluding it.

// Diagram: There are many overlapping subproblems when finding the solution to a problem state.

Conversely, the subproblem `knapsack(i, c)` can appear in multiple computations: in `knapsack(i, c + weights[i])` when the item at index `i` is included once, in `knapsack(i, c + 2 × weights[i])` when it is included twice, and so on. This chain of inclusions creates a pattern of overlapping subproblems along the capacity dimension that does not exist in the 0/1 variant.

// Diagram: A problem state may appear as a subproblem in many other problem states.

**Does the unbounded knapsack have more overlap than the 0/1 knapsack?** 

Yes. In the 0/1 knapsack, the include branch moves from `(i, c)` to `(i - 1, c - weights[i])` and each subproblem is reached from **at most** two parents. In the unbounded knapsack, the include branch moves from `(i, c)` to `(i, c - weights[i])` and the same item index `i` can generate a chain of subproblems `(i, c), (i, c - w), (i, c - 2w), ...` that all share further subproblems. This additional overlap along the capacity axis makes memoization even more beneficial.

A naïve recursive backtracking approach ends up solving the same subproblems multiple times when they are encountered through different recursive branches, leading to very poor performance. Since these overlapping subproblems exist, the problem can be solved much more efficiently using dynamic programming, either through a top-down approach with memoization or a bottom-up approach that builds solutions starting from the base cases.

***

# Understanding the bounded knapsack problem

In many real-world applications, software must make decisions under limited resources while also dealing with the limited availability of each option. In such situations, an item may not be restricted to a single choice but may also not be available an unlimited number of times. Instead, each item type may be selected multiple times up to a specified limit. Just like the regular 0/1 knapsack problem, each option provides some benefit, but selecting it consumes part of the available budget and may prevent other options from being chosen. The goal, therefore, is to determine which combination of options produces the greatest overall value without exceeding the given constraint.

A fundamental problem in this space is the bounded knapsack problem, which extends the classic knapsack framework to scenarios where items come in limited quantities.

// Diagram: The bounded knapsack problem.

The bounded knapsack problem mirrors real-world situations more accurately than the 0/1 variant, a few examples of which are: managing inventory where each product has limited stock, allocating bandwidth across multiple connection types with capacity constraints, loading containers with batches of goods, or selecting investments where each opportunity has a maximum investment limit.

In this lesson, we will learn about the bounded knapsack problem and how it can be solved efficiently using a dynamic programming solution.

## The bounded knapsack problem

Consider we are given `n` item types, where the item at index `i` has a weight `weights[i]`, a value `values[i]`, and a count `counts[i]` representing the maximum number of copies available. We also have a knapsack with a maximum weight capacity `capacity`. For the item at index `i`, we can take anywhere from `0` up to `counts[i]` copies.

// Diagram: We are given n items with their values, weights and counts, and we have a fixed capacity for the knapsack.

We need to find the maximum total value we can achieve by selecting copies of items such that their total weight does not exceed `capacity`.

// Diagram: We need to find the maximum total value we can achieve.

**How does the bounded knapsack differ from the 0/1 and unbounded variants?** 

In the 0/1 knapsack, each item can be taken at most once, i.e. the choice is simply include or exclude. In the unbounded knapsack, each item can be taken an unlimited number of times. The bounded knapsack sits between these two: the item at index `i` can be taken `0, 1, 2, ..., counts[i]` times. The 0/1 knapsack is a special case where `counts[i] = 1` for all `i`, and the unbounded knapsack is a special case where `counts[i] = ∞` for all `i`.

## Optimal substructure

It is easy to prove that the optimal solution to the bounded knapsack problem can be constructed from optimal solutions to its smaller subproblems. It is important to observe that when we consider items `0` through `i` and a knapsack with capacity `c`, we have multiple choices regarding how many copies of the item at index `i` to take.

For the item at index `i`, we can take `0, 1, 2, ...,` up to `counts[i]` copies, subject to the constraint that the total weight does not exceed our available capacity `c`. Specifically, if we take `k` copies of the item at index `i`, we consume `k × weights[i]` capacity and gain `k × values[i]` value.

The maximum number of copies we can actually take is `min(counts[i], c / weights[i])`. We are either limited by the availability of the item or by the remaining capacity `c` of the knapsack.

**Why do we take the minimum of `counts[i]` and `c / weights[i]`?** 

We cannot take more copies than are available (`counts[i]`), and we cannot take more copies than the capacity allows (`c / weights[i]`). The actual limit is whichever constraint is tighter. Note that because we can only take a whole number of items (not fractions), we use truncating integer division when calculating `c / weights[i]` so that any fractional part is discarded.

// Diagram: We can pick an item at index i upto min(counts\[i\], c/weights\[i\]) times.

For each valid choice of `k` copies (where `0 <= k <= min(counts[i], c / weights[i])`), we gain a value of `k × values[i]` from taking `k` copies and consume `k × weights[i]` capacity, leaving us with a remaining capacity of `c - (k × weights[i])` for items `0` through `i - 1`. The optimal solution is the choice of `k` that yields the maximum total value when combined with the optimal solution to the remaining subproblem.

**Why do we move to items `0` through `i - 1` after choosing `k` copies?** 

Once we have decided how many copies of the item at index `i` to take (including possibly zero), we have fully resolved the decision for this item. The remaining problem is to optimally fill the leftover capacity using only the items at indices `0` through `i - 1`. This is similar to the 0/1 knapsack, the difference is that instead of a binary include/exclude decision, we iterate over all valid quantities `k`.

// Diagram: After choosing the item at index i k times, choose from the items \[0...i-1\] with the remaining capacity.

Based on the above, it is clear that to find the maximum value achievable with items `0` through `i` and capacity `c`, we need to try all valid quantities of the item at index `i` and select the best outcome. For each `k` from `0` to `min(counts[i], c / weights[i])`, we compute the total value as `k × values[i]` plus the maximum value achievable with items `0` through `i - 1` and remaining capacity `c - k × weights[i]`. We then take the maximum across all these choices.

**Does this reduce to the 0/1 knapsack when `counts[i] = 1`?** 

Yes. When every item has a count of `1`, `k` can only be `0` or `1`. Taking `k = 0` is the exclude branch and `k = 1` is the include branch — exactly the two choices in the 0/1 knapsack recurrence.

The solution to the problem depends on the optimal solution of these smaller subproblems.

// Diagram: The optimal solution to the problem depends on the optimal solution to the smaller subproblems.

Note that the subproblems are uniquely identified by two dimensions: the index `i` of the last item under consideration and the remaining capacity `c`.

Based on the optimal substructure above, we can define the relationship between the problem and its subproblems. We can define a function `knapsack(i, c)` that returns the maximum value achievable using items `0` through `i` with a knapsack capacity of `c`.

// Diagram: Define a function knapsack to find the maximum value achievable when considering the items \[0...i\] with a capacity of c

The recurrence relation breaks the problem into smaller subproblems by reducing `i` by one after deciding how many copies of the item at index `i` to take. This reduction eventually reaches the point where `i` drops below `0`. When `i` is less than `0`, there are no items left to consider, so no value can be achieved and `knapsack` returns `0`. Additionally, when `c` is `0`, the knapsack has no remaining capacity, so no items can be added regardless of `i`, and `knapsack` returns `0`. These serve as the base cases of the recurrence relation, terminating the recursion.

**Why does the base case use `i < 0` instead of `i == 0`?** 

Since `i` is an index into the items, the value `i == 0` represents the state where we are considering the item at index `0`, which is still a valid item that can potentially be included. Only when `i` drops below `0` have we truly exhausted all items.

// Diagram: The base case for the bounded knapsack problem.

To get the solution for `knapsack(i, c)`, we iterate over all valid quantities `k` of the item at index `i` (from `0` to `min(counts[i], c / weights[i])`) and compute `k × values[i] + knapsack(i - 1, c - k × weights[i])` for each `k`. The solution is the maximum value among all these choices.

The recurrence relation below expresses the solution to the problem as a function of solutions to smaller problems. The solution to the original problem is `knapsack(n - 1, capacity)` where `n` is the number of item types and `capacity` is the knapsack capacity.

// Diagram: The recurrence relation for the bounded knapsack problem.

## Overlapping subproblems

It is easy to see that there are many overlapping subproblems in the recurrence relation to solve the bounded knapsack problem. To compute `knapsack(i, c)`, we may recursively compute `knapsack(i - 1, c - k × weights[i])` for various values of `k` representing different quantities of the item at index `i` taken.

Conversely, the subproblem `knapsack(i, c)` appears in the computation of `knapsack(i + 1, c)`, `knapsack(i + 1, c + weights[i + 1])`, `knapsack(i + 1, c + 2 × weights[i + 1])`, and so forth, depending on how many copies of the item at index `i + 1` are included in those computations. Every quantity choice `k` for the item at index `i + 1` (at different capacity values) that leaves exactly `c` remaining capacity will invoke the same subproblem `knapsack(i, c)`.

// Diagram: A problem state may appear as a subproblem in many other problem states.

**Does the bounded knapsack have more overlap than the 0/1 knapsack?** 

Yes. In the 0/1 knapsack, each state `(i, c)` is reached from at most two parents i.e. include or exclude. In the bounded knapsack, each state `(i, c)` can be reached from up to `counts[i + 1] + 1` parents, one for each valid quantity of the item at index `i + 1`. This increased fan-in means more paths converge on the same subproblems, making memoization even more beneficial.

A naïve recursive backtracking approach ends up solving the same subproblems multiple times when they are encountered through different recursive branches, leading to very poor performance. Since these overlapping subproblems exist, the problem can be solved much more efficiently using dynamic programming, either through a top-down approach with memoization or a bottom-up approach that builds solutions starting from the base cases.
