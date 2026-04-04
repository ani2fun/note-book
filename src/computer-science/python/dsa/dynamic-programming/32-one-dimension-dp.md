# 1-Dimension DP

One-dimensional DP usually means the state depends on one changing position or one integer `n`.

```python,editable
def climb_stairs(n):
    if n <= 2:
        return n

    prev2 = 1
    prev1 = 2
    for _ in range(3, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    return prev1


print(climb_stairs(5))
```

## Pattern

- define state
- write recurrence
- compute from small states to large ones
