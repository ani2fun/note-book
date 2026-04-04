# Adjacency List

An adjacency list stores, for each node, the nodes it connects to.

```python,editable
graph = {
    "A": ["B", "C"],
    "B": ["D"],
    "C": ["D"],
    "D": [],
}


for node, neighbors in graph.items():
    print(node, "->", neighbors)
```

This is the most common representation for sparse graphs.
