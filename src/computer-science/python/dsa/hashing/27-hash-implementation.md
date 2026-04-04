# Hash Implementation

A hash table usually combines three ideas:

1. a hash function turns a key into a number
2. that number maps into an array index
3. collisions are handled with chaining or probing

```python,editable
def simple_hash(key, size):
    total = 0
    for ch in key:
        total += ord(ch)
    return total % size


print(simple_hash("cat", 10))
print(simple_hash("tac", 10))
```

## Important idea

Different keys can land in the same bucket. That is a collision, and collision handling is what makes the structure work correctly.
