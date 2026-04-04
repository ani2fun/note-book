# Merge Sort

Merge sort uses divide and conquer:

1. split the array into halves
2. sort each half
3. merge the sorted halves

```python,editable
def merge_sort(nums):
    if len(nums) <= 1:
        return nums[:]

    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])

    merged = []
    i = 0
    j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1

    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged


print(merge_sort([5, 1, 4, 2, 8, 3]))
```

## Why it matters

- stable and predictable
- strong example of recursion
- much faster than quadratic sorts on large inputs

## Cost

- time: `O(n log n)`
- extra space: `O(n)`
