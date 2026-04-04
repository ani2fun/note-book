# Search Range

When duplicates are allowed, binary search is often used twice:

- once for the left boundary
- once for the right boundary

```python,editable
def boundary_search(nums, target, find_first):
    left = 0
    right = len(nums) - 1
    answer = -1

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            answer = mid
            if find_first:
                right = mid - 1
            else:
                left = mid + 1
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return answer


def search_range(nums, target):
    return [
        boundary_search(nums, target, True),
        boundary_search(nums, target, False),
    ]


print(search_range([1, 2, 2, 2, 3, 4], 2))
```

This is a very common “binary search on condition” pattern.
