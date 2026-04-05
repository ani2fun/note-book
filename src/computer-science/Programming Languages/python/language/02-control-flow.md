# Control Flow and Loops

Most DSA solutions are built from a small set of control-flow patterns.

## Conditions

```python,editable
value = 7

if value % 2 == 0:
    print("even")
elif value % 3 == 0:
    print("divisible by 3")
else:
    print("other")
```

## `for` loops

Use `for` when you know the range or want to iterate directly over values.

```python,editable
nums = [4, 8, 15, 16]

for x in nums:
    print("value:", x)

for i in range(len(nums)):
    print("index:", i, "value:", nums[i])
```

## `while` loops

Use `while` when the loop condition changes dynamically, such as with binary search or fast/slow pointers.

```python,editable
left = 0
right = 5

while left < right:
    mid = (left + right) // 2
    print(left, mid, right)
    left += 1
```

## Loop helpers

`enumerate` and `zip` keep code cleaner than manual indexing.

```python,editable
letters = ["a", "b", "c"]
scores = [10, 20, 30]

for i, ch in enumerate(letters):
    print(i, ch)

for ch, score in zip(letters, scores):
    print(ch, score)
```

## Pattern intuition

- Traversal of an array: `for i in range(n)`
- Two pointers: `while left < right`
- Repeated processing until empty: `while stack`
- BFS queue processing: `while queue`
