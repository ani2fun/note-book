# Tree Maze

Backtracking is a search technique:

1. choose
2. explore
3. undo

```python,editable
def paths(grid):
    rows = len(grid)
    cols = len(grid[0])
    result = []
    path = []

    def dfs(r, c):
        if r >= rows or c >= cols or grid[r][c] == 1:
            return
        if r == rows - 1 and c == cols - 1:
            result.append(path + [(r, c)])
            return

        grid[r][c] = 1
        path.append((r, c))
        dfs(r + 1, c)
        dfs(r, c + 1)
        path.pop()
        grid[r][c] = 0

    dfs(0, 0)
    return result


print(paths([[0, 0, 0], [0, 1, 0], [0, 0, 0]]))
```

The key step is undoing the choice before returning.
