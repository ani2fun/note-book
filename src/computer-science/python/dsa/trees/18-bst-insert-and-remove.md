# BST Insert and Remove

Insertion follows the BST order rule until it finds an empty spot.

Deletion has three cases:

- leaf node
- one child
- two children

```python,editable
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(root, value):
    if root is None:
        return Node(value)
    if value < root.value:
        root.left = insert(root.left, value)
    elif value > root.value:
        root.right = insert(root.right, value)
    return root


def inorder(root):
    if root is None:
        return []
    return inorder(root.left) + [root.value] + inorder(root.right)


root = None
for x in [8, 3, 10, 1, 6]:
    root = insert(root, x)

print(inorder(root))
```

For remove, the hardest case is “two children”, where we usually replace the node with its inorder successor.
