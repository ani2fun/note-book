# Stacks

A stack is a linear structure that allows updates at one end only: the top.

## Rule

Last in, first out.

- `push`
- `pop`
- `peek`

```mermaid
flowchart TB
    subgraph Push["Push onto stack"]
        P4["4"]
        P3["3"]
        P2["2"]
        P1["1"]
        TOP1["top"]
    end

    TOP1 --> P4
```

```mermaid
flowchart TB
    subgraph Pop["Pop from stack"]
        X4["4 (removed)"]
        X3["3"]
        X2["2"]
        X1["1"]
        TOP2["new top"]
    end

    TOP2 --> X3
```

```python,editable
class Stack:
    def __init__(self):
        self.data = []

    def push(self, value):
        self.data.append(value)

    def pop(self):
        if not self.data:
            raise IndexError("empty stack")
        return self.data.pop()

    def peek(self):
        if not self.data:
            raise IndexError("empty stack")
        return self.data[-1]


stack = Stack()
for value in [1, 2, 3, 4]:
    stack.push(value)

print(stack.peek())
print(stack.pop())
print(stack.data)
```

## Common uses

- expression evaluation
- undo behavior
- DFS
- recursion simulation

## Cost

- `push`: `O(1)` amortized
- `pop`: `O(1)`
- `peek`: `O(1)`
