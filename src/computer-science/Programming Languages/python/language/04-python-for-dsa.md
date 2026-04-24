# Python Tools for DSA

This is the Python toolkit that shows up again and again in DSA solutions.

## Lists

```python,editable
nums = [10, 20, 30]
nums.append(40)
last = nums.pop()

print(nums)
print(last)
print(nums[0], nums[-1])
```

## Dictionaries

```python,editable
counts = {}
for ch in "banana":
    counts[ch] = counts.get(ch, 0) + 1

print(counts)
```

## Sets

```python,editable
seen = set()

for x in [3, 1, 4, 1, 5]:
    if x in seen:
        print("duplicate:", x)
        break
    seen.add(x)
```

## Tuples

Tuples are useful when you want an immutable pair like `(row, col)` or `(distance, node)`.

```python,editable
point = (2, 5)
row, col = point
print(row, col)
```

## Useful built-ins

```python,editable
nums = [7, 2, 9, 4]

print("sorted:", sorted(nums))
print("min:", min(nums))
print("max:", max(nums))
print("sum:", sum(nums))
```

## Interview habit

Before writing a custom data structure in Python, ask:

- Can `list` solve this?
- Do I need a `set` for membership?
- Do I need a `dict` for lookup?
- Is a tuple the cleanest key or state representation?
