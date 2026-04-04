# Introduction

Python is a strong language for DSA practice because the syntax stays small while the standard data structures stay powerful.

## What matters most for DSA work

- Variables are dynamically typed.
- Lists, sets, dictionaries, and strings are built in.
- Indentation defines code blocks.
- Readability is a feature, not just style.

```python,editable
name = "Python"
year = 1991
is_good_for_dsa = True

print(name)
print(year)
print(is_good_for_dsa)
print(type(name), type(year), type(is_good_for_dsa))
```

## Primitive values you will use often

```python,editable
count = 5              # int
ratio = 2.5            # float
title = "graph"        # str
active = False         # bool
nothing = None         # NoneType

print(count, ratio, title, active, nothing)
```

## Mutability matters

Lists and dictionaries are mutable. Strings and tuples are not.

```python,editable
numbers = [1, 2, 3]
numbers[1] = 99

word = "stack"
updated = word.upper()

print(numbers)
print(word)
print(updated)
```

## A small habit that helps

Name things after meaning, not after syntax.

- Better: `left`, `right`, `window_sum`, `visited`
- Worse: `a`, `b`, `temp2`, `x1`

That habit makes two-pointer, recursion, and graph code much easier to debug.
