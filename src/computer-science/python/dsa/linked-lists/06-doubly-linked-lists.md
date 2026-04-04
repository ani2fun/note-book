# Doubly Linked Lists

A doubly linked list stores both `next` and `prev`, so movement works in both directions.

```python,editable
class Node:
    def __init__(self, value):
        self.value = value
        self.prev = None
        self.next = None


class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def append(self, value):
        node = Node(value)
        if self.head is None:
            self.head = self.tail = node
            return
        node.prev = self.tail
        self.tail.next = node
        self.tail = node

    def delete_tail(self):
        if self.tail is None:
            return None
        value = self.tail.value
        if self.head == self.tail:
            self.head = self.tail = None
            return value
        self.tail = self.tail.prev
        self.tail.next = None
        return value

    def values(self):
        out = []
        cur = self.head
        while cur:
            out.append(cur.value)
            cur = cur.next
        return out


dll = DoublyLinkedList()
for x in [2, 4, 6]:
    dll.append(x)

print(dll.values())
print("removed:", dll.delete_tail())
print(dll.values())
```

## Why use it

- easier deletion near the tail
- backward traversal
- useful for deques, LRU-style structures, and editor/history behavior

## Cost

The benefit is flexibility. The cost is extra memory per node and more pointer maintenance.
