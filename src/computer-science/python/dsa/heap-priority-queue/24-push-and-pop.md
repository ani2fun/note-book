# Push and Pop

Python exposes a min-heap through `heapq`.

```python,editable
import heapq


heap = []
for x in [7, 2, 9, 4]:
    heapq.heappush(heap, x)

print(heap)
print(heapq.heappop(heap))
print(heap)
```

## What happens internally

- `heappush`: append then bubble up
- `heappop`: move last item to root then bubble down
