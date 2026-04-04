# Bucket Sort

Bucket sort distributes values into groups, sorts each group, then concatenates the results.

It works best when values are spread fairly evenly across a known range.

```python,editable
def bucket_sort(nums, bucket_count=5):
    if not nums:
        return []

    min_value = min(nums)
    max_value = max(nums)
    if min_value == max_value:
        return nums[:]

    buckets = [[] for _ in range(bucket_count)]
    span = max_value - min_value + 1

    for x in nums:
        index = (x - min_value) * bucket_count // span
        if index == bucket_count:
            index -= 1
        buckets[index].append(x)

    result = []
    for bucket in buckets:
        result.extend(sorted(bucket))
    return result


print(bucket_sort([29, 25, 3, 49, 9, 37, 21, 43]))
```

## Idea

- distribute
- sort within each bucket
- merge buckets in order
