# Searching

Searching is the silent foundation under most algorithms in this course — and binary search is the silent foundation under searching. Eleven lessons cover binary search and its variants: lower bound, upper bound, 2D matrix searches, sorted-rotated arrays, plus five **pattern lessons** that generalise the algorithm to predicate-based searches over numeric ranges.

The section progresses from concrete to abstract: the first three lessons (Binary Search, Lower Bound, Upper Bound) cover the three primitive 1D variants. The next three (2D Binary Search, Staircase Search, Sorted Rotated Array) lift to 2D matrices and broken-input scenarios. The five pattern lessons (Binary Search Pattern, Lower Bound Pattern, Upper Bound Pattern, Minimum Predicate Search, Maximum Predicate Search) round it out — each with four worked problems showing how to recognise and apply binary-search-style algorithms in scenarios that don't initially look like searches.

## Guides

Read in order if you're learning binary search for the first time; jump directly to a named pattern for revision.

- [Binary Search](./01-binary-search.md) — the foundation. `O(log n)` lookup of a target in a sorted array.
- [Lower Bound](./02-lower-bound.md) — first index `≥ target`. The "where would I insert this?" primitive.
- [Upper Bound](./03-upper-bound.md) — first index `> target`. With lower bound, enables count-occurrences in `O(log n)`.
- [2D Binary Search](./04-2d-binary-search.md) — searches a row-major-sorted matrix in `O(log(N·M))` via index flattening.
- [Staircase Search](./05-staircase-search.md) — searches a row-and-column-sorted matrix in `O(N + M)` via corner walk.
- [Sorted Rotated Array](./06-sorted-rotated-array.md) — finds min and target in a rotated sorted array. Two `O(log n)` algorithms.
- [Pattern: Binary Search](./07-pattern-binary-search.md) — direct binary search applications: recovery, descending arrays, multi-row matrices, intersection.
- [Pattern: Lower Bound](./08-pattern-lower-bound.md) — insertion position, first-and-last range, closest element, k-closest window.
- [Pattern: Upper Bound](./09-pattern-upper-bound.md) — count threshold, first-positive, ceiling, breaking index.
- [Pattern: Minimum Predicate Search](./10-pattern-minimum-predicate-search.md) — binary search on the *answer*. Speed, penalty, capacity, completion-time problems.
- [Pattern: Maximum Predicate Search](./11-pattern-maximum-predicate-search.md) — the dual: square root, staircase, ribbon length, water equalisation.

## Reading guide

The 11 lessons break naturally into three groups:

1. **Primitives (Binary Search, Lower Bound, Upper Bound)** — the three variants you'll use directly in 90% of search problems.
2. **2D and broken-input (2D Binary Search, Staircase Search, Sorted Rotated Array)** — extending binary search to matrices and rotated arrays. Each requires one structural twist on the primitive.
3. **Pattern lessons (Binary Search Pattern, Lower Bound Pattern, Upper Bound Pattern, Minimum and Maximum Predicate Search)** — abstracting binary search to recognise it across problem domains. The first three pattern lessons directly apply the primitives; the two predicate-search lessons generalise to "binary search on the answer" with custom predicates.

If you're already comfortable with binary search, skim the Binary Search lesson and start at the Lower Bound lesson. The pattern lessons reuse the three primitives (Binary Search, Lower Bound, Upper Bound) heavily — read them first.

Each lesson's transfer challenge pre-loads the next lesson, so reading in sequence is the smoothest path.
