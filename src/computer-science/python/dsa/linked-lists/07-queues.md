# Queues

A queue processes items in first-in, first-out order.

## Rule

First in, first out.

- enqueue at the back
- dequeue from the front

## Python implementation

```python,editable
from collections import deque


queue = deque()
queue.append(10)
queue.append(20)
queue.append(30)

print(queue.popleft())
print(queue)
```

## Why `deque` instead of `list`

Removing from the front of a list is `O(n)` because everything shifts left.

With `deque`:

- enqueue: `O(1)`
- dequeue: `O(1)`

## Common uses

- BFS
- task scheduling
- producer-consumer pipelines
