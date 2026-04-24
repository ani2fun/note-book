# Notebook Feature Test

This page demos every interactive feature of the note-book. Use it to verify that tabs, code execution, and SQL all work correctly after a build.

---

## Multi-Language Tabs — Full Example

The block below groups multiple implementations of the same algorithm — sum of a list — under a single tab bar. Tabs are sorted in canonical order (Python first). Click a tab to switch. Run the `,editable` blocks with the **▶** button or **Ctrl+Enter**.

> **Offline:** Python and JavaScript run entirely in your browser.
> **Remote:** Java, C, C++, Go, Kotlin, Scala, and Rust are sent to the self-hosted [Piston API](https://piston.kakde.eu) running on the Kubernetes cluster.

<div class="lang-tabs">

```python,editable
# Python — runs offline via Pyodide
numbers = [1, 2, 3, 4, 5]
total   = sum(numbers)
print(f"Numbers : {numbers}")
print(f"Sum     : {total}")
print(f"Average : {total / len(numbers):.1f}")
```

```java,editable
// Java — runs via the self-hosted Piston API
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        int total = 0;
        for (int n : numbers) total += n;
        System.out.println("Numbers : " + Arrays.toString(numbers));
        System.out.println("Sum     : " + total);
        System.out.printf("Average : %.1f%n", (double) total / numbers.length);
    }
}
```

```c,editable
// C — runs via the self-hosted Piston API
#include <stdio.h>

int main() {
    int numbers[] = {1, 2, 3, 4, 5};
    int n = sizeof(numbers) / sizeof(numbers[0]);
    int total = 0;
    for (int i = 0; i < n; i++) total += numbers[i];
    printf("Numbers : [1, 2, 3, 4, 5]\n");
    printf("Sum     : %d\n", total);
    printf("Average : %.1f\n", (double) total / n);
    return 0;
}
```

```cpp,editable
// C++ — runs via the self-hosted Piston API
#include <iomanip>
#include <iostream>
#include <numeric>
#include <vector>

int main() {
    std::vector<int> numbers{1, 2, 3, 4, 5};
    int total = std::accumulate(numbers.begin(), numbers.end(), 0);

    std::cout << "Numbers : [";
    for (std::size_t i = 0; i < numbers.size(); ++i) {
        if (i > 0) std::cout << ", ";
        std::cout << numbers[i];
    }
    std::cout << "]\n";
    std::cout << "Sum     : " << total << "\n";
    std::cout << "Average : " << std::fixed << std::setprecision(1)
              << static_cast<double>(total) / numbers.size() << "\n";
}
```

```scala,editable
// Scala — runs via the self-hosted Piston API
object Main extends App {
  val numbers = List(1, 2, 3, 4, 5)
  val total   = numbers.sum
  println(s"Numbers : $numbers")
  println(s"Sum     : $total")
  println(f"Average : ${total.toDouble / numbers.length}%.1f")
}
```

```javascript,editable
// JavaScript — runs offline in your browser
const numbers = [1, 2, 3, 4, 5];
const total   = numbers.reduce((a, b) => a + b, 0);
console.log(`Numbers : [${numbers}]`);
console.log(`Sum     : ${total}`);
console.log(`Average : ${(total / numbers.length).toFixed(1)}`);
```

```typescript,editable
// TypeScript — transpiled to JS then run in browser
const numbers: number[] = [1, 2, 3, 4, 5];
const total: number     = numbers.reduce((a, b) => a + b, 0);
console.log(`Numbers : [${numbers}]`);
console.log(`Sum     : ${total}`);
console.log(`Average : ${(total / numbers.length).toFixed(1)}`);
```

```go,editable
// Go — runs via the self-hosted Piston API
package main

import "fmt"

func main() {
    numbers := []int{1, 2, 3, 4, 5}
    total := 0
    for _, n := range numbers {
        total += n
    }
    fmt.Println("Numbers :", numbers)
    fmt.Println("Sum     :", total)
    fmt.Printf("Average : %.1f\n", float64(total)/float64(len(numbers)))
}
```

```kotlin,editable
// Kotlin — runs via the self-hosted Piston API
fun main() {
    val numbers = listOf(1, 2, 3, 4, 5)
    val total = numbers.sum()

    println("Numbers : $numbers")
    println("Sum     : $total")
    println("Average : %.1f".format(total.toDouble() / numbers.size))
}
```

```rust,editable
// Rust — runs via the self-hosted Piston API
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    let total: i32 = numbers.iter().sum();

    println!("Numbers : {:?}", numbers);
    println!("Sum     : {}", total);
    println!("Average : {:.1}", total as f64 / numbers.len() as f64);
}
```

</div>

---

## Multi-Language Tabs — Partial Example (Python + JavaScript only)

Verifies that only the languages **present** in the block appear as tabs (no phantom tabs for missing languages).

<div class="lang-tabs">

```python,editable
# FizzBuzz — Python
for i in range(1, 21):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
```

```javascript,editable
// FizzBuzz — JavaScript
for (let i = 1; i <= 20; i++) {
    if      (i % 15 === 0) console.log("FizzBuzz");
    else if (i % 3  === 0) console.log("Fizz");
    else if (i % 5  === 0) console.log("Buzz");
    else                   console.log(i);
}
```

</div>

---

## Standalone Python Block (regression test)

Independent of any tab group. Should still have Run + Reset buttons and execute via Pyodide.

```python,editable
# Two Sum — Two-Pointer approach
from typing import List

def two_sum(arr: List[int], target: int) -> List[int]:
    arr.sort()
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if   s == target: return [arr[left], arr[right]]
        elif s  < target: left  += 1
        else:             right -= 1
    return []

print(two_sum([2, 8, 3, 6, 4], 7))    # [3, 4]
print(two_sum([-3, -1, 0, 2, 4, 6], 3))  # [-3, 6]
print(two_sum([1, 2, 3], 100))         # []
```

---

## Standalone SQL Block (regression test)

Runs locally via sql.js — no server needed.

```sql
-- Create a sample table and query it
CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER);
INSERT INTO employees VALUES (1, 'Alice', 95000);
INSERT INTO employees VALUES (2, 'Bob',   82000);
INSERT INTO employees VALUES (3, 'Carol', 110000);
INSERT INTO employees VALUES (4, 'Dave',  75000);

-- Top earners
SELECT name, salary
FROM   employees
WHERE  salary > 85000
ORDER  BY salary DESC;
```

---

## TypeScript — standalone (regression test)

```typescript,editable
// Generic identity function with type inference
function identity<T>(value: T): T {
    return value;
}

interface Point {
    x: number;
    y: number;
}

function distance(a: Point, b: Point): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

const p1: Point = { x: 0, y: 0 };
const p2: Point = { x: 3, y: 4 };

console.log("Identity:", identity("hello TypeScript"));
console.log(`Distance from (0,0) to (3,4): ${distance(p1, p2)}`);
```
