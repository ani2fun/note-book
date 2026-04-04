# Matrix DFS

Grid problems are graph problems in disguise.

```python,editable
def count_island_size(grid, start_r, start_c):
    rows = len(grid)
    cols = len(grid[0])
    seen = set()

    def dfs(r, c):
        if (
            r < 0 or r >= rows or
            c < 0 or c >= cols or
            grid[r][c] == 0 or
            (r, c) in seen
        ):
            return 0

        seen.add((r, c))
        size = 1
        size += dfs(r + 1, c)
        size += dfs(r - 1, c)
        size += dfs(r, c + 1)
        size += dfs(r, c - 1)
        return size

    return dfs(start_r, start_c)


grid = [
    [1, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
]
print(count_island_size(grid, 0, 0))
```
