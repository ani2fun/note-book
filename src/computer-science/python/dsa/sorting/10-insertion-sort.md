# Insertion Sort

Insertion sort grows a sorted prefix one element at a time.

```python,editable
def insertion_sort(nums):
    arr = nums[:]
    for i in range(1, len(arr)):
        current = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > current:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = current
    return arr


print(insertion_sort([5, 2, 4, 6, 1, 3]))
```

## Why learn it

- easy to implement
- efficient on small arrays
- strong mental model for shifting elements in place

## Cost

- worst case: `O(n^2)`
- best case on nearly sorted input: close to `O(n)`
