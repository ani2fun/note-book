# Collections and Loops

## Lists

```python,editable
servers = ["dns", "ingress", "database", "monitoring"]

print("Services in the stack:")
for service in servers:
    print("-", service)
```

## Dictionaries

```python,editable
pod_status = {
    "api": "Running",
    "worker": "Running",
    "postgres": "Pending",
}

for component, status in pod_status.items():
    print(f"{component}: {status}")
```

## Loop with accumulation

```python,editable
numbers = [4, 8, 15, 16, 23, 42]
total = 0

for number in numbers:
    total += number

average = total / len(numbers)

print("Sum:", total)
print("Average:", average)
```
