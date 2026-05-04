# Recursion

Recursive code crashes for reasons that look like dark magic — until you can name the four regions of memory every running program already lives in. This section builds that mental model, then turns it into a complete map of recursion: every running program is a building under construction, every function call is a tier of scaffolding, and every recursion pattern is just a different way of using that scaffold to build an answer.

By the end of the seven lessons you'll be able to look at a fresh problem and (a) decide whether it's recursive, (b) classify it into one of four canonical patterns, and (c) write the code without thinking. You'll also have the prerequisites for dynamic programming and divide-and-conquer — the next two major topics in the algorithms section.

## Guides

Read in order if you're learning the topic for the first time; jump directly to a named pattern for revision.

- [Introduction to Memory Model](./01-introduction-to-memory-model.md) — the four regions every process lives in, set up via the construction-site analogy used throughout the section.
- [Nested Functions](./02-nested-functions.md) — what's inside a stack frame, how nested calls grow and unwind, the three ways the stack can overflow.
- [Recursion](./03-recursion.md) — the ATM-queue intuition, base case + recursive relation, recursion trees, and what recursion costs in time and space.
- [Pattern: Head Recursion](./04-pattern-head-recursion.md) — descend silently, work on the way up. Four worked problems including factorial and reversing a queue.
- [Pattern: Tail Recursion](./05-pattern-tail-recursion.md) — work on the way down with an accumulator; tail-call optimisation across all 10 languages of this course.
- [Pattern: Multiple Recursion](./06-pattern-multiple-recursion.md) — branching call trees, exponential time, and the canonical "this is why memoisation exists" problem.
- [Pattern: Multidimensional Recursion](./07-pattern-multidimensional-recursion.md) — 2D state spaces, multiple base-case boundaries, the bridge into dynamic programming.

## Reading guide

If you're already comfortable with stack memory and how function calls grow the stack, skim the Memory Model and Nested Functions lessons and start at the Recursion lesson. If you've written recursive code but never been able to predict its time/space cost on sight, the four pattern lessons (Head, Tail, Multiple, Multidimensional Recursion) are the heart of the section — they classify recursion problems by tree shape and give you the diagnostic questions to recognise each pattern.

The four patterns build on each other. Head recursion (the Head Recursion lesson) is the foundation; tail recursion (the Tail Recursion lesson) flips the timing; multiple recursion (the Multiple Recursion lesson) adds branching; multidimensional recursion (the Multidimensional Recursion lesson) adds extra axes. Each lesson's transfer challenge pre-loads the next lesson — they're meant to be read in sequence.
