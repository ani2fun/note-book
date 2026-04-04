# Quick Sort

Quick sort chooses a pivot, partitions values around it, and recursively sorts the two sides.

```python,editable
def quick_sort(nums):
    arr = nums[:]

    def sort(left, right):
        if left >= right:
            return

        pivot = arr[right]
        i = left
        for j in range(left, right):
            if arr[j] <= pivot:
                arr[i], arr[j] = arr[j], arr[i]
                i += 1

        arr[i], arr[right] = arr[right], arr[i]
        sort(left, i - 1)
        sort(i + 1, right)

    sort(0, len(arr) - 1)
    return arr


print(quick_sort([5, 1, 4, 2, 8, 3]))
```

## Notes

- average time: `O(n log n)`
- worst case: `O(n^2)` with poor pivots
- often very fast in practice
