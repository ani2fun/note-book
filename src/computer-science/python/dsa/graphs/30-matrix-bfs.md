# Matrix BFS

BFS is ideal when you want the shortest path in an unweighted grid.

```python,editable
from collections import deque


def shortest_path(grid):
    rows = len(grid)
    cols = len(grid[0])
    queue = deque([(0, 0, 0)])
    seen = {(0, 0)}

    while queue:
        r, c, dist = queue.popleft()
        if (r, c) == (rows - 1, cols - 1):
            return dist

        for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            nr, nc = r + dr, c + dc
            if (
                0 <= nr < rows and
                0 <= nc < cols and
                grid[nr][nc] == 0 and
                (nr, nc) not in seen
            ):
                seen.add((nr, nc))
                queue.append((nr, nc, dist + 1))

    return -1


print(shortest_path([[0, 0, 1], [1, 0, 1], [0, 0, 0]]))
```
