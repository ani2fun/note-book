# Functions and Modules

## Functions

```python,editable
def greet(name):
    return f"Hello, {name}!"

print(greet("Python learner"))
print(greet("Browser runtime"))
```

## Returning multiple values

```python,editable
def summarize(values):
    total = sum(values)
    count = len(values)
    average = total / count
    return total, count, average

numbers = [10, 20, 30, 40]
total, count, average = summarize(numbers)

print("Total:", total)
print("Count:", count)
print("Average:", average)
```

## Importing from the standard library

```python,editable
from math import sqrt

for value in [4, 9, 16, 25]:
    print(f"sqrt({value}) = {sqrt(value)}")
```
