# 2-Dimension DP

Two-dimensional DP is common when the answer depends on two indices.

```python,editable
def unique_paths(rows, cols):
    dp = [[1] * cols for _ in range(rows)]

    for r in range(1, rows):
        for c in range(1, cols):
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]

    return dp[rows - 1][cols - 1]


print(unique_paths(3, 4))
```

Typical examples include grid paths, edit distance, and longest common subsequence.
