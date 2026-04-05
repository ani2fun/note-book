# Functions, Classes, and Exceptions

You do not need advanced Python to solve most DSA problems, but you do need a few essentials.

## Functions

```python,editable
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a


print(gcd(18, 24))
```

## Type hints

Type hints improve readability even when the interpreter does not enforce them.

```python,editable
from typing import List


def prefix_sums(nums: List[int]) -> List[int]:
    result = []
    running = 0
    for x in nums:
        running += x
        result.append(running)
    return result


print(prefix_sums([1, 2, 3, 4]))
```

## Small classes

Classes matter most in DSA when we model nodes and custom structures.

```python,editable
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


head = Node(10)
head.next = Node(20)
print(head.value, head.next.value)
```

## Exceptions

Raising a clear error is often better than silently returning the wrong result.

```python,editable
def top(stack):
    if not stack:
        raise IndexError("stack is empty")
    return stack[-1]


print(top([5, 7, 9]))
```

## A practical rule

- Use functions for algorithms.
- Use classes for linked lists, trees, graphs, and reusable structures.
- Raise exceptions when an invalid operation should be explicit.
