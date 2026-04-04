# Fibonacci Sequence

Fibonacci is useful because it shows both the beauty and the danger of recursion.

## Naive recursive version

```python,editable
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)


for n in range(8):
    print(n, fib(n))
```

This version is elegant but slow because it recomputes the same subproblems many times.

## Dynamic programming version

```python,editable
def fib_dp(n):
    if n <= 1:
        return n

    prev2 = 0
    prev1 = 1
    for _ in range(2, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    return prev1


for n in range(8):
    print(n, fib_dp(n))
```

## Lesson

- recursion helps express the recurrence
- memoization or iteration usually fixes the performance problem
