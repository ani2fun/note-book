# Heapify

Why build a heap one element at a time in O(n log n) when you can do it in O(n)?

If you already have all the data up front, there is a smarter approach called **heapify**. Instead of pushing each element individually and sifting it up, you start from the middle of the array and sift down each node. The result is a valid heap in linear time.

## Why Start From the Middle?

Leaf nodes (roughly the second half of the array) are already valid one-element heaps — there is nothing to do for them. The first internal node that can actually have children is at index `(n // 2) - 1`. That is where the work begins.

For an array of length 6, index `(6 // 2) - 1 = 2` is the last internal node. We sift down from index 2, then 1, then 0.

## Step-by-Step: Heapify `[3, 1, 6, 5, 2, 4]`

```mermaid
flowchart TD
    subgraph Start["Starting array: 3, 1, 6, 5, 2, 4"]
        N0["3\n idx 0"] --> N1["1\n idx 1"]
        N0 --> N2["6\n idx 2"]
        N1 --> N3["5\n idx 3"]
        N1 --> N4["2\n idx 4"]
        N2 --> N5["4\n idx 5"]
    end

    subgraph Step1["Step 1: sift down idx 2 (value 6) — child 4 is smaller, swap"]
        S1N0["3"] --> S1N1["1"]
        S1N0 --> S1N2["4 ↑"]
        S1N1 --> S1N3["5"]
        S1N1 --> S1N4["2"]
        S1N2 --> S1N5["6 ↓"]
    end

    subgraph Step2["Step 2: sift down idx 1 (value 1) — children are 5 and 2; 1 < both, no swap"]
        S2N0["3"] --> S2N1["1"]
        S2N0 --> S2N2["4"]
        S2N1 --> S2N3["5"]
        S2N1 --> S2N4["2"]
        S2N2 --> S2N5["6"]
    end

    subgraph Step3["Step 3: sift down idx 0 (value 3) — children are 1 and 4; 1 is smallest, swap"]
        S3N0["1 ↑"] --> S3N1["3 ↓"]
        S3N0 --> S3N2["4"]
        S3N1 --> S3N3["5"]
        S3N1 --> S3N4["2"]
        S3N2 --> S3N5["6"]
    end

    subgraph Step4["Step 4: continue sifting 3 down — children 5 and 2; swap with 2"]
        S4N0["1"] --> S4N1["2 ↑"]
        S4N0 --> S4N2["4"]
        S4N1 --> S4N3["5"]
        S4N1 --> S4N4["3 ↓"]
        S4N2 --> S4N5["6"]
    end

    Start --> Step1 --> Step2 --> Step3 --> Step4
```

Final heap array: `[1, 2, 4, 5, 3, 6]`

## Implementing Heapify From Scratch

```python,editable
def sift_down(arr, i, n):
    """Sift the element at index i down until the heap property holds."""
    while True:
        smallest = i
        left  = 2 * i + 1
        right = 2 * i + 2
        if left < n and arr[left] < arr[smallest]:
            smallest = left
        if right < n and arr[right] < arr[smallest]:
            smallest = right
        if smallest == i:
            break
        arr[i], arr[smallest] = arr[smallest], arr[i]
        i = smallest

def heapify(arr):
    """Turn arr into a valid min-heap in-place in O(n) time."""
    n = len(arr)
    # Start from the last internal node and work backwards to the root
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, i, n)

# --- Demo ---
data = [3, 1, 6, 5, 2, 4]
print("Before heapify:", data)
heapify(data)
print("After heapify: ", data)

# Verify: extract elements in sorted order
import heapq
import copy
heap_copy = copy.copy(data)
sorted_vals = []
while heap_copy:
    # manually pop using our sift_down
    heap_copy[0], heap_copy[-1] = heap_copy[-1], heap_copy[0]
    sorted_vals.append(heap_copy.pop())
    sift_down(heap_copy, 0, len(heap_copy))
print("Elements in min order:", sorted_vals)
```

## Using Python's heapq.heapify()

`heapq.heapify()` does the same thing in-place, transforming any list into a min-heap:

```python,editable
import heapq

data = [3, 1, 6, 5, 2, 4]
print("Before:", data)

heapq.heapify(data)   # O(n), in-place
print("After: ", data)

# heapq.heapify guarantees data[0] is the minimum
print("Minimum:", data[0])

# Pull all elements out in sorted order
print("Sorted:", [heapq.heappop(data) for _ in range(len(data) + 0)])
```

## Why O(n) and Not O(n log n)?

It feels like it should be O(n log n) — we call sift_down on n/2 nodes, and sift_down is O(log n). But not every sift_down call does the same amount of work.

- Nodes near the bottom of the tree have very little room to sift down (height 0 or 1).
- Only the root can sift down the full tree height.

When you add up the actual work across all levels, the total converges to O(n). The formal proof uses the fact that there are at most n/2^(h+1) nodes at height h, each doing O(h) work — and the sum ∑ h / 2^h converges to a constant.

| Method            | Time       | When to use                         |
|-------------------|------------|-------------------------------------|
| Push n times      | O(n log n) | Elements arrive one at a time       |
| heapify once      | O(n)       | All data available at the start     |

## Real-World Applications

**Heap Sort**: heapify the array in O(n), then repeatedly extract the minimum in O(log n). Total: O(n log n) with O(1) extra space — a fully in-place sort.

```python,editable
import heapq

def heap_sort(arr):
    heapq.heapify(arr)
    return [heapq.heappop(arr) for _ in range(len(arr))]

numbers = [42, 7, 19, 3, 55, 1, 28]
print("Unsorted:", numbers)
print("Sorted:  ", heap_sort(numbers))
```

**One-time priority queue setup**: when a system starts up with a known backlog of jobs (e.g. a build system loading thousands of pending tasks from a database), heapify transforms the entire backlog into a priority queue in linear time, ready for O(log n) push/pop from that point on.
