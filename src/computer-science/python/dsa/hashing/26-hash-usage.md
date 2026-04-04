# Hash Usage

Hash-based structures are everywhere in DSA.

```python,editable
def contains_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False


def frequency_count(text):
    counts = {}
    for ch in text:
        counts[ch] = counts.get(ch, 0) + 1
    return counts


print(contains_duplicate([1, 2, 3, 1]))
print(frequency_count("banana"))
```

## Typical use cases

- membership checks
- frequency counting
- complement lookup
- grouping values by key
