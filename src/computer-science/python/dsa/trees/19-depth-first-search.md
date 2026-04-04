# Depth-First Search

DFS goes as deep as possible before backing up.

For trees, the common recursive traversals are:

- preorder: root, left, right
- inorder: left, root, right
- postorder: left, right, root

```python,editable
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right


root = Node(1, Node(2, Node(4), Node(5)), Node(3))


def preorder(node):
    if node is None:
        return []
    return [node.value] + preorder(node.left) + preorder(node.right)


def inorder(node):
    if node is None:
        return []
    return inorder(node.left) + [node.value] + inorder(node.right)


print(preorder(root))
print(inorder(root))
```
