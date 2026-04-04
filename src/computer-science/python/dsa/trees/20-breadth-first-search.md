# Breadth-First Search

BFS visits nodes level by level, usually with a queue.

```python,editable
from collections import deque


class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right


root = Node(1, Node(2, Node(4), Node(5)), Node(3))


def level_order(root):
    if root is None:
        return []

    queue = deque([root])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node.value)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)

    return order


print(level_order(root))
```
