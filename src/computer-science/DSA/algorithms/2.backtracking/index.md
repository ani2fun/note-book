# Backtracking

Backtracking is brute force in tree form. Every problem with the shape "list every X" or "find one X that satisfies the constraints" can be cast as a depth-first walk over a state space tree, and the algorithm becomes a recursive function with a `for` loop, a base case for leaves, and an undo step in the loop body. Three patterns cover almost every backtracking problem you'll meet: enumerate without filtering (the Unconditional Enumeration lesson), enumerate with pruning (the Conditional Enumeration lesson), or search a configuration of the world for one that satisfies all constraints (the Backtracking Search lesson).

By the end of these four lessons you'll be able to look at a fresh problem and (a) decide whether it's a backtracking problem, (b) classify it into one of the three patterns, and (c) write the code without thinking. You'll also have the prerequisite for the harder dynamic-programming problems coming up later in the course — many of them are backtracking searches with memoisation bolted on.

## Guides

Read in order if you're learning backtracking for the first time; jump directly to a named pattern for revision.

- [Introduction to Backtracking](./01-introduction-to-backtracking.md) — what backtracking is, the three components every solution carries, the state space tree, the phone-PIN warm-up.
- [Pattern: Unconditional Enumeration](./02-pattern-unconditional-enumeration.md) — every leaf is a solution; no pruning. Subsets, sequences, phone-keypad combinations.
- [Pattern: Conditional Enumeration](./03-pattern-conditional-enumeration.md) — pruning by constraint. Balanced parentheses, target-sum combinations, IP-address generation, permutations.
- [Pattern: Backtracking Search](./04-pattern-backtracking-search.md) — mutate the world; propagate true on success; undo on failure. Maze pathfinding, word search, N-queens, sudoku.

## Reading guide

If you're already comfortable with recursion's mechanics (the Recursion lesson of the recursion section), skim the Introduction to Backtracking lesson of this section and start at the Unconditional Enumeration lesson. The three pattern lessons build on each other: unconditional enumeration is the base case, conditional adds pruning, search swaps in mutation-and-undo. Each lesson's transfer challenge pre-loads the next lesson, so they're meant to be read in sequence.
