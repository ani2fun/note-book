# Hash Usage

Count word frequencies in a book in O(n) time. Detect whether two strings are anagrams in O(n). Solve the two-sum problem in a single pass. All of these become trivial with a hash map.

This chapter is about the **patterns** — the recurring ways that hash maps and sets appear in real problems.

## Pattern 1: Frequency Counter

Count how many times each element appears. The canonical use is word counting, but the same pattern applies to characters, numbers, or any hashable value.

```python,editable
from collections import Counter

text = "the quick brown fox jumps over the lazy dog the fox"

# Manual approach
freq = {}
for word in text.split():
    freq[word] = freq.get(word, 0) + 1

print("Manual frequency count:")
for word, count in sorted(freq.items(), key=lambda x: -x[1]):
    print(f"  {word}: {count}")

# Python shortcut: Counter
counter = Counter(text.split())
print("\nTop 3 words:", counter.most_common(3))
```

**Real-world use**: search engines count term frequencies to rank pages. Spam filters count word patterns to detect junk email.

## Pattern 2: Two-Sum (Complement Lookup)

Given an array and a target, find two numbers that add up to the target. The naive approach is O(n²) — check every pair. The hash map approach is O(n).

```python,editable
def two_sum(nums, target):
    """Return indices of two numbers that add to target. O(n) time, O(n) space."""
    seen = {}   # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))    # [0, 1]  (2 + 7 = 9)
print(two_sum([3, 2, 4], 6))         # [1, 2]  (2 + 4 = 6)
print(two_sum([1, 5, 3, 7], 10))     # [1, 3]  (5 + 7 = 10... wait: 3 + 7 = 10)

# Walkthrough of the algorithm
print("\nStep-by-step for [2, 7, 11, 15], target=9:")
nums, target = [2, 7, 11, 15], 9
seen = {}
for i, num in enumerate(nums):
    complement = target - num
    print(f"  i={i} num={num}  need {complement}  seen={seen}  found={complement in seen}")
    seen[num] = i
```

The key insight: for each number `x`, instead of scanning the array for `target - x`, you look it up in the hash map in O(1).

## Pattern 3: Anagram Detection

Two strings are anagrams if they contain the same characters with the same frequencies.

```python,editable
from collections import Counter

def is_anagram(s, t):
    """Check if s and t are anagrams. O(n) time."""
    return Counter(s) == Counter(t)

def group_anagrams(words):
    """Group a list of words by their anagram signature. O(n * k) where k = max word length."""
    groups = {}
    for word in words:
        key = tuple(sorted(word))   # canonical form: sorted characters
        groups.setdefault(key, []).append(word)
    return list(groups.values())


print(is_anagram("listen", "silent"))    # True
print(is_anagram("hello", "world"))      # False

word_list = ["eat", "tea", "tan", "ate", "nat", "bat"]
print("\nAnagram groups:", group_anagrams(word_list))
```

## Pattern 4: Duplicate Detection and Uniqueness

A hash set answers "have I seen this before?" in O(1).

```python,editable
def contains_duplicate(nums):
    return len(nums) != len(set(nums))

def first_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return num
        seen.add(num)
    return None

def longest_unique_substring(s):
    """Sliding window + set: O(n)."""
    char_set = set()
    left = 0
    best = 0
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        best = max(best, right - left + 1)
    return best

print(contains_duplicate([1, 2, 3, 1]))      # True
print(contains_duplicate([1, 2, 3, 4]))      # False
print(first_duplicate([3, 1, 4, 1, 5, 9]))   # 1
print(longest_unique_substring("abcabcbb"))  # 3  ("abc")
print(longest_unique_substring("pwwkew"))    # 3  ("wke")
```

## Hash vs List: A Speed Comparison

```python,editable
import time
import random

n = 100_000
data = list(range(n))
data_set = set(data)
lookups = [random.randint(0, n * 2) for _ in range(10_000)]

# List: O(n) per lookup
start = time.perf_counter()
for val in lookups:
    _ = val in data
list_time = time.perf_counter() - start

# Set: O(1) per lookup
start = time.perf_counter()
for val in lookups:
    _ = val in data_set
set_time = time.perf_counter() - start

print(f"List lookup (10k queries in {n} items): {list_time * 1000:.1f} ms")
print(f"Set  lookup (10k queries in {n} items): {set_time  * 1000:.1f} ms")
print(f"Speedup: {list_time / set_time:.0f}x faster with a set")
```

## Pattern 5: Memoization (Caching)

Store the results of expensive function calls in a dict so you never compute the same input twice.

```python,editable
import time

# Without memoization — exponential time
def fib_slow(n):
    if n <= 1:
        return n
    return fib_slow(n - 1) + fib_slow(n - 2)

# With memoization — O(n) time
def fib_fast(n, cache={}):
    if n in cache:
        return cache[n]
    if n <= 1:
        return n
    cache[n] = fib_fast(n - 1) + fib_fast(n - 2)
    return cache[n]

# Python provides @functools.lru_cache as a decorator
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

start = time.perf_counter()
result_slow = fib_slow(35)
slow_time = time.perf_counter() - start

start = time.perf_counter()
result_fast = fib(35)
fast_time = time.perf_counter() - start

print(f"fib(35) = {result_slow}  (slow: {slow_time*1000:.0f} ms)")
print(f"fib(35) = {result_fast}  (fast: {fast_time*1000:.2f} ms)")
print(f"Speedup: {slow_time / fast_time:.0f}x")
```

## Common Hash Map Operations at a Glance

```python,editable
d = {}

# Insert / update
d["key"] = "value"

# Lookup (raises KeyError if missing)
# val = d["key"]

# Safe lookup with default
val = d.get("key", "default")
print("get:", val)

# Check membership
print("in:", "key" in d)

# Delete
d["temp"] = 42
del d["temp"]

# Iterate
d = {"a": 1, "b": 2, "c": 3}
print("keys:  ", list(d.keys()))
print("values:", list(d.values()))
print("items: ", list(d.items()))

# setdefault: insert only if key absent
d.setdefault("d", 0)
d["d"] += 1
print("setdefault:", d)

# defaultdict: auto-initialise missing keys
from collections import defaultdict
graph = defaultdict(list)
graph["A"].append("B")
graph["A"].append("C")
print("defaultdict graph:", dict(graph))
```
