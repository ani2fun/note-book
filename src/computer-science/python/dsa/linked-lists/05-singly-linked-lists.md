# Singly Linked Lists

A singly linked list stores nodes that point only to the next node.

## Node structure

```python,editable
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None
```

## List with head and tail

```python,editable
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


class SinglyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def append(self, value):
        node = Node(value)
        if self.head is None:
            self.head = self.tail = node
            return
        self.tail.next = node
        self.tail = node

    def prepend(self, value):
        node = Node(value)
        node.next = self.head
        self.head = node
        if self.tail is None:
            self.tail = node

    def values(self):
        out = []
        cur = self.head
        while cur:
            out.append(cur.value)
            cur = cur.next
        return out


ll = SinglyLinkedList()
for x in [2, 4, 6]:
    ll.append(x)
ll.prepend(0)
print(ll.values())
```

## Key trade-off

- Access by index: `O(n)`
- Insert at front: `O(1)`
- Append with tail pointer: `O(1)`

Without a tail pointer, repeated append becomes `O(n^2)` over `n` insertions.
