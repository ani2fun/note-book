# DSA in Python — Course Track

> Learn to think like a computer scientist. This track takes you from raw memory all the way to dynamic programming, building genuine intuition at every step.

---

## Why This Track Exists

Every time you use Google Maps, Spotify's shuffle, or Instagram's feed, data structures and algorithms are running underneath. The code that makes those products fast isn't magic — it's the same ideas you'll learn here, applied with care.

This track is structured like a course with a deliberate progression:

1. **Start with memory and arrays** — understand how data actually lives in RAM before touching any abstraction.
2. **Move to linear structures** — linked lists and queues that flex where arrays are rigid.
3. **Build recursion intuition** — train your brain to think in sub-problems.
4. **Master sorting** — the proving ground for algorithmic thinking.
5. **Climb to advanced territory** — trees, graphs, heaps, hashing, and dynamic programming.

Each section answers three questions: *What is the data layout? Which operations are cheap? What trade-off is being made?*

---

## Sections

- [Introduction](./00-introduction.md)
  *What is a data structure? What is an algorithm? Why do they power the modern world?*

- [Algorithm Analysis](./algorithm_analysis_tutorial.md)
  *Big O notation, time vs space complexity, and how to reason about performance mathematically.*

---

### Arrays
*The foundation of almost every other data structure. Understand arrays and you understand memory.*

- [Overview](./arrays/index.md)
- [RAM](./arrays/01-ram.md) — *How your computer actually stores data at the byte level.*
- [Static Arrays](./arrays/02-static-arrays.md) — *Fixed-size, blazing fast, and the basis for everything else.*
- [Dynamic Arrays](./arrays/03-dynamic-arrays.md) — *How Python lists grow themselves automatically.*
- [Stacks](./arrays/04-stacks.md) — *Last in, first out — the secret behind undo buttons and function calls.*
- [Kadane's Algorithm](./arrays/05-kadanes-algorithm.md) — *Find the maximum-sum subarray in a single pass.*
- [Sliding Window — Fixed Size](./arrays/06-sliding-window-fixed.md) — *Efficiently process every window of size k.*
- [Sliding Window — Variable Size](./arrays/07-sliding-window-variable.md) — *Expand and shrink a window to meet a condition.*
- [Two Pointers](./arrays/08-two-pointers.md) — *Solve array problems with two indices moving toward each other.*
- [Prefix Sums](./arrays/09-prefix-sums.md) — *Answer range-sum queries in O(1) after O(n) setup.*

---

### Linked Lists
*Flexible structures where elements can live anywhere in memory, connected by pointers.*

- [Overview](./linked-lists/index.md)
- [Singly Linked Lists](./linked-lists/05-singly-linked-lists.md) — *Chains of nodes, each pointing forward.*
- [Doubly Linked Lists](./linked-lists/06-doubly-linked-lists.md) — *Chains that can walk backwards too.*
- [Queues](./linked-lists/07-queues.md) — *First in, first out — how printers and task schedulers work.*
- [Fast and Slow Pointers](./linked-lists/08-fast-slow-pointers.md) — *Detect cycles and find midpoints with two pointers at different speeds.*

---

### Recursion
*The art of solving a problem by solving a smaller version of itself.*

- [Overview](./recursion/index.md)
- [Factorial](./recursion/08-factorial.md) — *The classic entry point into recursive thinking.*
- [Fibonacci Sequence](./recursion/09-fibonacci-sequence.md) — *Where naive recursion meets its first performance wall.*

---

### Sorting
*Rearranging data is the most studied problem in computer science — and for good reason.*

- [Overview](./sorting/index.md)
- [Insertion Sort](./sorting/10-insertion-sort.md) — *Simple, intuitive, and surprisingly fast on small inputs.*
- [Merge Sort](./sorting/11-merge-sort.md) — *Divide, conquer, and merge — reliably O(n log n).*
- [Quick Sort](./sorting/12-quick-sort.md) — *The algorithm powering most real-world sort implementations.*
- [Bucket Sort](./sorting/13-bucket-sort.md) — *When you know something about your data, you can beat O(n log n).*

---

### Binary Search
*Find anything in a sorted collection in O(log n) — eliminate half the possibilities each step.*

- [Overview](./binary-search/index.md)
- [Search Array](./binary-search/14-search-array.md)
- [Search Range](./binary-search/15-search-range.md)

---

### Trees
*Hierarchical structures that power databases, file systems, and autocomplete.*

- [Overview](./trees/index.md)
- [Binary Tree](./trees/16-binary-tree.md) — *Each node has at most two children.*
- [Binary Search Tree](./trees/17-binary-search-tree.md) — *A sorted tree you can search in O(log n).*
- [BST Insert and Remove](./trees/18-bst-insert-and-remove.md)
- [Depth-First Search](./trees/19-depth-first-search.md) — *Explore a tree going deep before going wide.*
- [Breadth-First Search](./trees/20-breadth-first-search.md) — *Explore layer by layer, level by level.*
- [BST Sets and Maps](./trees/21-bst-sets-and-maps.md) — *How Python's `set` and `dict` are built.*
- [Trie](./trees/22-trie.md) — *A tree for storing strings — the backbone of autocomplete.*
- [Union-Find](./trees/23-union-find.md) — *Track connected components with near-O(1) union and find.*
- [Segment Tree](./trees/24-segment-tree.md) — *Range queries and updates in O(log n).*
- [Iterative DFS](./trees/25-iterative-dfs.md) — *DFS without recursion using an explicit stack.*

---

### Backtracking
*Explore every possibility systematically — and prune dead ends early.*

- [Overview](./backtracking/index.md)
- [Tree Maze](./backtracking/22-tree-maze.md) — *Navigate a maze by trying every path and retreating when stuck.*
- [Subsets](./backtracking/23-subsets.md) — *Generate every subset of a set systematically.*
- [Combinations](./backtracking/24-combinations.md) — *Choose k items from n — without repetition.*
- [Permutations](./backtracking/25-permutations.md) — *Every possible ordering of a set of elements.*

---

### Heap / Priority Queue
*Always get the minimum (or maximum) element in O(log n). Used in Dijkstra's and task scheduling.*

- [Overview](./heap-priority-queue/index.md)
- [Heap Properties](./heap-priority-queue/23-heap-properties.md)
- [Push and Pop](./heap-priority-queue/24-push-and-pop.md)
- [Heapify](./heap-priority-queue/25-heapify.md) — *Build a heap from an array in O(n).*
- [Two Heaps](./heap-priority-queue/26-two-heaps.md) — *Use a min-heap and max-heap together to track medians in real time.*

---

### Hashing
*The secret behind Python's dict and set — O(1) average lookup via math.*

- [Overview](./hashing/index.md)
- [Hash Usage](./hashing/26-hash-usage.md) — *Using hash maps and sets to solve problems fast.*
- [Hash Implementation](./hashing/27-hash-implementation.md) — *How collision resolution actually works inside.*

---

### Graphs
*The most general structure — social networks, maps, and the internet are all graphs.*

- [Overview](./graphs/index.md)
- [Intro to Graphs](./graphs/28-intro-to-graphs.md) — *Nodes, edges, directed vs undirected.*
- [Matrix DFS](./graphs/29-matrix-dfs.md)
- [Matrix BFS](./graphs/30-matrix-bfs.md)
- [Adjacency List](./graphs/31-adjacency-list.md) — *The most efficient graph representation for sparse graphs.*
- [Dijkstra's](./graphs/32-dijkstras.md) — *Shortest path in a weighted graph using a priority queue.*
- [Prim's](./graphs/33-prims.md) — *Build a minimum spanning tree greedily, edge by edge.*
- [Kruskal's](./graphs/34-kruskals.md) — *Build an MST by sorting edges and avoiding cycles.*
- [Topological Sort](./graphs/35-topological-sort.md) — *Order tasks so every dependency comes before the task that needs it.*

---

### Dynamic Programming
*Solve complex problems by caching the results of overlapping sub-problems.*

- [Overview](./dynamic-programming/index.md)
- [1-Dimension DP](./dynamic-programming/32-one-dimension-dp.md) — *Single-variable state: climbing stairs, coin change.*
- [2-Dimension DP](./dynamic-programming/33-two-dimension-dp.md) — *Grid problems and string comparisons.*
- [0 / 1 Knapsack](./dynamic-programming/34-knapsack-01.md) — *Pick items with weights and values — each item used at most once.*
- [Unbounded Knapsack](./dynamic-programming/35-unbounded-knapsack.md) — *Same as knapsack but items can be reused unlimited times.*
- [LCS](./dynamic-programming/36-lcs.md) — *Find the longest sequence common to two strings.*
- [Palindromes](./dynamic-programming/37-palindromes.md) — *Detect and build palindromic substrings with DP.*

---

### Bit Manipulation
*Use binary operations directly — the lowest level of computation, and often the fastest.*

- [Overview](./bit-manipulation/index.md)
- [Bit Operations](./bit-manipulation/34-bit-operations.md) — *AND, OR, XOR, shifts — and why they matter.*
