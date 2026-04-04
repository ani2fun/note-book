# Dynamic Arrays

Dynamic arrays keep the fast indexed access of arrays while adding the ability to grow.

Python `list` already behaves like a dynamic array, but the resizing idea is worth understanding.

## Push at the end

When free capacity exists, append is simple.

```mermaid
flowchart LR
    subgraph Before["capacity = 3, length = 2"]
        B0["0: 5"]
        B1["1: 6"]
        B2["2: _"]
    end

    subgraph After["pushback(7)"]
        A0["0: 5"]
        A1["1: 6"]
        A2["2: 7"]
    end

    Before --> After
```

```python,editable
class DynamicArray:
    def __init__(self):
        self.capacity = 2
        self.length = 0
        self.arr = [0] * self.capacity

    def pushback(self, value):
        if self.length == self.capacity:
            self.resize()
        self.arr[self.length] = value
        self.length += 1

    def resize(self):
        self.capacity *= 2
        new_arr = [0] * self.capacity
        for i in range(self.length):
            new_arr[i] = self.arr[i]
        self.arr = new_arr

    def values(self):
        return self.arr[:self.length]
```

## Resize

When capacity fills up, allocate a bigger array and copy values over.

```mermaid
flowchart LR
    subgraph Old["old array (capacity = 2)"]
        O0["0: 5"]
        O1["1: 6"]
    end

    subgraph New["new array (capacity = 4)"]
        N0["0: 5"]
        N1["1: 6"]
        N2["2: _"]
        N3["3: _"]
    end

    O0 --> N0
    O1 --> N1
```

```mermaid
flowchart LR
    C1["capacity 1"] --> C2["capacity 2"]
    C2 --> C4["capacity 4"]
    C4 --> C8["capacity 8"]
```

```python,editable
dyn = DynamicArray()

for value in [5, 6, 7, 8, 9]:
    dyn.pushback(value)
    print("values =", dyn.values(), "| length =", dyn.length, "| capacity =", dyn.capacity)
```

## Why append is amortized `O(1)`

- A resize costs `O(n)`.
- Resizes do not happen on every append.
- Doubling spreads expensive copies across many cheap appends.

That is why dynamic-array append is usually described as amortized `O(1)`.
