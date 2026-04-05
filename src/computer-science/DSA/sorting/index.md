# Sorting Algorithms

Your phone contacts, your Spotify playlist, your Amazon search results — all sorted. Sorting is one of the most fundamental operations in computing. Without it, searching would be slow, databases would grind to a halt, and every app you use daily would feel sluggish.

Understanding sorting algorithms teaches you to think about **trade-offs**: speed vs. memory, simplicity vs. efficiency, best-case vs. worst-case. These are the same trade-offs you encounter in every engineering decision.

## Why do we need multiple sorting algorithms?

There is no single best sorting algorithm. The right choice depends on:

- **How much data?** 10 items vs. 10 million items changes everything.
- **Is it already partially sorted?** Some algorithms exploit existing order.
- **Do equal elements need to stay in their original order?** (Stability)
- **How much extra memory can we use?** In-place vs. auxiliary space.
- **What is the data's distribution?** Uniform? Skewed? Bounded range?

## Algorithm Comparison

| Algorithm | Best Case | Average Case | Worst Case | Space | Stable? |
|---|---|---|---|---|---|
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Bucket Sort | O(n + k) | O(n + k) | O(n²) | O(n + k) | Yes |

*k = number of buckets*

## Visualising Complexity

```mermaid
flowchart TD
    subgraph Legend["Time Complexity Growth"]
        A["n = 1,000 elements"]
    end

    subgraph Insertion["Insertion Sort — O(n²)"]
        B["1,000² = 1,000,000 operations"]
    end

    subgraph Merge["Merge Sort — O(n log n)"]
        C["1,000 × 10 = 10,000 operations"]
    end

    subgraph Quick["Quick Sort — O(n log n) avg"]
        D["1,000 × 10 ≈ 10,000 operations"]
    end

    subgraph Bucket["Bucket Sort — O(n + k)"]
        E["1,000 + k ≈ linear operations"]
    end

    A --> B
    A --> C
    A --> D
    A --> E
```

## When to use each

```mermaid
flowchart TD
    Start([You need to sort data]) --> Q1{How many elements?}
    Q1 -->|"Small — under ~50"| Q2{Nearly sorted?}
    Q1 -->|"Large — thousands+"| Q3{Known numeric range?}

    Q2 -->|Yes| Ins[Insertion Sort\nExploits existing order]
    Q2 -->|No| Ins2[Insertion Sort\nStill fast for tiny n]

    Q3 -->|Yes, uniform spread| Bkt[Bucket Sort\nLinear time possible]
    Q3 -->|No / unknown| Q4{Need stable sort?}

    Q4 -->|Yes| Mrg[Merge Sort\nGuaranteed O n log n]
    Q4 -->|No| Qck[Quick Sort\nFastest in practice]
```

## In this section

- **Insertion Sort** — Start here. It mirrors how humans naturally sort cards.
- **Merge Sort** — Learn divide and conquer. Guaranteed O(n log n) always.
- **Quick Sort** — The workhorse of standard libraries. Fast in practice.
- **Bucket Sort** — Linear time when you know your data's range.
