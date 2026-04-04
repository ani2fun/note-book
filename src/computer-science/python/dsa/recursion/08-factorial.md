# Factorial

Factorial is a small problem, but it teaches the two most important recursion ideas:

- base case
- recursive case

## Recursive version

```python,editable
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)


for n in range(6):
    print(n, factorial(n))
```

## Iterative version

```python,editable
def factorial_iterative(n):
    result = 1
    for x in range(2, n + 1):
        result *= x
    return result


print(factorial_iterative(5))
```

## What recursion is doing

Each call pauses, waits for a smaller answer, then continues. The call stack remembers the suspended work.
