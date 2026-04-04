# Bit Operations

The most common operators are:

- `&` AND
- `|` OR
- `^` XOR
- `~` NOT
- `<<` left shift
- `>>` right shift

```python,editable
a = 6   # 110
b = 3   # 011

print(a & b)
print(a | b)
print(a ^ b)
print(a << 1)
print(a >> 1)
```

## Why this matters

- check parity
- build masks
- encode state compactly
- solve some problems faster than with arrays or sets
