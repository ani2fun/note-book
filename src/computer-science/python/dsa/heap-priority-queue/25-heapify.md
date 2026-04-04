# Heapify

`heapify` turns an unsorted array into a heap in linear time.

```python,editable
import heapq


nums = [9, 4, 7, 1, 3, 6]
heapq.heapify(nums)
print(nums)
```

This is faster than pushing every value one by one when you already have all the data.
