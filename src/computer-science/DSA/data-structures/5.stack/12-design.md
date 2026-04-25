# 12. Design

## The Hook

A normal stack does push, pop, and peek in O(1). What if you also wanted **`getMin()`** in O(1) — the smallest value currently in the stack, every time, no scanning? Walking the stack from top to bottom would be O(N), and a bag of cleverness ("just store the running min on a separate stack") feels too easy. The actual interview question is sharper: **using only one stack, can you give me push, pop, top, AND getMin all in O(1)?**

Yes. The trick is to **encode the previous minimum directly into the storage stack** — when you push a new minimum, you push the *old* minimum onto the stack first, then push the new value on top. The new value becomes the visible top; the saved old min sits one below, ready to resurface when this new-minimum value is eventually popped. The math works out because the only time we need the *old* min is exactly when we pop the *current* min — at that moment, the next thing under the popped value is the saved old min, and we restore it as the new current min.

This lesson is two problems — **Min Stack** and its mirror **Max Stack**. Both demonstrate the same composition idea: an O(1) auxiliary slot (a single integer) plus a single stack adds an entirely new query (`getMin`/`getMax`) without breaking any existing O(1) guarantee. It's the same architectural move we saw in the hash-table design lesson — *compose the data structure with one auxiliary piece to add a new operation* — applied to stacks.

---

## Table of contents

1. [Design a Min Stack](#design-a-min-stack)
2. [Design a Max Stack](#design-a-max-stack)

***

# Design a Min Stack

## Problem Statement

Implement a `MinStack` class with the following operations, all amortised **O(1)**:

> -   **`MinStack()`** — initialise.
> -   **`push(int val)`** — push onto the top.
> -   **`pop()`** — remove and discard the top.
> -   **`top()`** — return the top element.
> -   **`getMin()`** — return the smallest value currently in the stack.

> **Constraints:**
> - `getMin()` must run in **O(1)**.
> - You may use only **one** internal stack.
> - Assume no duplicate values are ever pushed.

> **Example:**
>
> | Operation | Stack state | Output |
> |---|---|---|
> | `MinStack()` | `[]` | `null` |
> | `push(2)` | `[2]` | `null` |
> | `push(3)` | `[3, 2]` (top first) | `null` |
> | `top()` | `[3, 2]` | `3` |
> | `getMin()` | `[3, 2]` | `2` |
> | `pop()` | `[2]` | `null` |
> | `getMin()` | `[2]` | `2` |
> | `push(-1)` | `[-1, 2]` | `null` |
> | `getMin()` | `[-1, 2]` | `-1` |

## Approach — encode the previous minimum into the stack

The clever invariant: maintain a running `min` field; when a *new* minimum arrives, **push the OLD min onto the stack first**, *then* push the new value. Update `min` to the new value.

Now the stack contains, just below every "minimum so far" record, the previous minimum. When we eventually pop the current min, we know to also pop the saved previous min — and that saved value becomes the new current min.

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#64748b"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
    subgraph PUSH3["push(3) — 3 > min(=∞)? no, just push"]
        S1["stack: [3]<br/>min: 3"]
    end
    subgraph PUSH2["push(2) — new min!<br/>push old min (3), then 2<br/>update min to 2"]
        S2["stack: [3, 3, 2]<br/>min: 2"]
    end
    subgraph POP["pop() — top is 2 = current min<br/>pop 2, then pop 3 (saved old min)<br/>restore min to 3"]
        S3["stack: [3]<br/>min: 3"]
    end
    PUSH3 --> PUSH2 --> POP
```

<p align="center"><strong>Min Stack — when a new min lands, the previous min is buried just below it. When the current min is popped, restore from the buried record. Push of a non-min value is just a regular push.</strong></p>

> **Why this works** — the key observation is that the only time we need the *previous* min is when we *remove* the current min. At that moment, the value sitting just under the current-min slot is exactly the previous min. So encoding it inline is sufficient — we don't need a parallel auxiliary stack.

## Solution

<div class="lang-tabs">

```python,editable
import sys

class MinStack:
    def __init__(self):
        self.stack = []
        self.min = sys.maxsize

    def push(self, val: int) -> None:
        # When a new min lands, push the old min first as a "burial record",
        # then push val. Otherwise just push val.
        if val <= self.min:
            self.stack.append(self.min)
            self.min = val
        self.stack.append(val)

    def pop(self) -> None:
        # If we're popping the current min, also pop the burial record
        # and restore min to it.
        top = self.stack.pop()
        if top == self.min:
            self.min = self.stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min

# Boss-fight demo
s = MinStack()
s.push(2); s.push(3)
print(s.top())     # 3
print(s.getMin())  # 2
s.pop()
print(s.getMin())  # 2
s.push(-1)
print(s.getMin())  # -1
```

```java,editable
import java.util.*;
public class Main {
    static class MinStack {
        private final Deque<Integer> stack = new ArrayDeque<>();
        private int min = Integer.MAX_VALUE;

        public void push(int val) {
            if (val <= min) { stack.push(min); min = val; }
            stack.push(val);
        }
        public void pop() {
            int top = stack.pop();
            if (top == min) min = stack.pop();
        }
        public int top()    { return stack.peek(); }
        public int getMin() { return min; }
    }
    public static void main(String[] args) {
        MinStack s = new MinStack();
        s.push(2); s.push(3);
        System.out.println(s.top());
        System.out.println(s.getMin());
        s.pop();
        System.out.println(s.getMin());
        s.push(-1);
        System.out.println(s.getMin());
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

typedef struct {
    int *arr;
    int  capacity, top;
    int  min;
} MinStack;

MinStack* min_stack_new(void) {
    MinStack *s = malloc(sizeof(*s));
    s->capacity = 256; s->arr = malloc(sizeof(int) * s->capacity);
    s->top = -1; s->min = INT_MAX;
    return s;
}
void min_stack_push(MinStack *s, int val) {
    if (val <= s->min) { s->arr[++s->top] = s->min; s->min = val; }
    s->arr[++s->top] = val;
}
void min_stack_pop(MinStack *s) {
    int top = s->arr[s->top--];
    if (top == s->min) s->min = s->arr[s->top--];
}
int  min_stack_top(MinStack *s)    { return s->arr[s->top]; }
int  min_stack_get_min(MinStack *s){ return s->min; }

int main() {
    MinStack *s = min_stack_new();
    min_stack_push(s, 2); min_stack_push(s, 3);
    printf("%d\n", min_stack_top(s));
    printf("%d\n", min_stack_get_min(s));
    min_stack_pop(s);
    printf("%d\n", min_stack_get_min(s));
    min_stack_push(s, -1);
    printf("%d\n", min_stack_get_min(s));
}
```

```cpp,editable
#include <iostream>
#include <stack>
#include <climits>

class MinStack {
    std::stack<int> stack;
    int             min = INT_MAX;
public:
    void push(int val) {
        if (val <= min) { stack.push(min); min = val; }
        stack.push(val);
    }
    void pop() {
        int top = stack.top(); stack.pop();
        if (top == min) { min = stack.top(); stack.pop(); }
    }
    int top()    { return stack.top(); }
    int getMin() { return min; }
};

int main() {
    MinStack s;
    s.push(2); s.push(3);
    std::cout << s.top()    << "\n";
    std::cout << s.getMin() << "\n";
    s.pop();
    std::cout << s.getMin() << "\n";
    s.push(-1);
    std::cout << s.getMin() << "\n";
}
```

```scala,editable
import scala.collection.mutable

class MinStack {
  private val stack = mutable.Stack[Int]()
  private var min   = Int.MaxValue

  def push(v: Int): Unit = {
    if (v <= min) { stack.push(min); min = v }
    stack.push(v)
  }
  def pop(): Unit = {
    val top = stack.pop()
    if (top == min) min = stack.pop()
  }
  def top:    Int = stack.top
  def getMin: Int = min
}

object Main extends App {
  val s = new MinStack
  s.push(2); s.push(3)
  println(s.top); println(s.getMin)
  s.pop()
  println(s.getMin)
  s.push(-1)
  println(s.getMin)
}
```

```javascript,editable
class MinStack {
    constructor() {
        this.stack = [];
        this.min   = Number.MAX_SAFE_INTEGER;
    }
    push(val) {
        if (val <= this.min) { this.stack.push(this.min); this.min = val; }
        this.stack.push(val);
    }
    pop() {
        const top = this.stack.pop();
        if (top === this.min) this.min = this.stack.pop();
    }
    top()    { return this.stack[this.stack.length - 1]; }
    getMin() { return this.min; }
}

const s = new MinStack();
s.push(2); s.push(3);
console.log(s.top());       // 3
console.log(s.getMin());    // 2
s.pop();
console.log(s.getMin());    // 2
s.push(-1);
console.log(s.getMin());    // -1
```

```typescript,editable
class MinStack {
    private stack: number[] = [];
    private min:   number   = Number.MAX_SAFE_INTEGER;

    push(val: number): void {
        if (val <= this.min) { this.stack.push(this.min); this.min = val; }
        this.stack.push(val);
    }
    pop(): void {
        const top = this.stack.pop()!;
        if (top === this.min) this.min = this.stack.pop()!;
    }
    top():    number { return this.stack[this.stack.length - 1]; }
    getMin(): number { return this.min; }
}

const s = new MinStack();
s.push(2); s.push(3);
console.log(s.top());
console.log(s.getMin());
s.pop();
console.log(s.getMin());
s.push(-1);
console.log(s.getMin());
```

```go,editable
package main
import "fmt"
import "math"

type MinStack struct {
    stack []int
    min   int
}

func NewMinStack() *MinStack { return &MinStack{min: math.MaxInt32} }

func (s *MinStack) Push(val int) {
    if val <= s.min { s.stack = append(s.stack, s.min); s.min = val }
    s.stack = append(s.stack, val)
}
func (s *MinStack) Pop() {
    top := s.stack[len(s.stack)-1]; s.stack = s.stack[:len(s.stack)-1]
    if top == s.min { s.min = s.stack[len(s.stack)-1]; s.stack = s.stack[:len(s.stack)-1] }
}
func (s *MinStack) Top()    int { return s.stack[len(s.stack)-1] }
func (s *MinStack) GetMin() int { return s.min }

func main() {
    s := NewMinStack()
    s.Push(2); s.Push(3)
    fmt.Println(s.Top())
    fmt.Println(s.GetMin())
    s.Pop()
    fmt.Println(s.GetMin())
    s.Push(-1)
    fmt.Println(s.GetMin())
}
```

```kotlin,editable
class MinStack {
    private val stack = ArrayDeque<Int>()
    private var min   = Int.MAX_VALUE

    fun push(v: Int) {
        if (v <= min) { stack.addLast(min); min = v }
        stack.addLast(v)
    }
    fun pop() {
        val top = stack.removeLast()
        if (top == min) min = stack.removeLast()
    }
    fun top():    Int = stack.last()
    fun getMin(): Int = min
}

fun main() {
    val s = MinStack()
    s.push(2); s.push(3)
    println(s.top()); println(s.getMin())
    s.pop()
    println(s.getMin())
    s.push(-1)
    println(s.getMin())
}
```

```rust,editable
pub struct MinStack {
    stack: Vec<i32>,
    min:   i32,
}

impl MinStack {
    pub fn new() -> Self { MinStack { stack: Vec::new(), min: i32::MAX } }

    pub fn push(&mut self, val: i32) {
        if val <= self.min { self.stack.push(self.min); self.min = val; }
        self.stack.push(val);
    }
    pub fn pop(&mut self) {
        let top = self.stack.pop().unwrap();
        if top == self.min { self.min = self.stack.pop().unwrap(); }
    }
    pub fn top(&self)     -> i32 { *self.stack.last().unwrap() }
    pub fn get_min(&self) -> i32 { self.min }
}

fn main() {
    let mut s = MinStack::new();
    s.push(2); s.push(3);
    println!("{}", s.top());
    println!("{}", s.get_min());
    s.pop();
    println!("{}", s.get_min());
    s.push(-1);
    println!("{}", s.get_min());
}
```

</div>

***

# Design a Max Stack

## Problem Statement

Identical to Min Stack, but track the **maximum** instead of the minimum.

> -   **`MaxStack()`**, **`push(val)`**, **`pop()`**, **`top()`** — same semantics.
> -   **`getMax()`** — return the largest value currently in the stack, in **O(1)**.

> **Constraints:**
> - `getMax()` must run in **O(1)**.
> - Use only one internal stack.
> - No duplicate values.

> **Example:**
>
> | Operation | Stack state | Output |
> |---|---|---|
> | `MaxStack()` | `[]` | `null` |
> | `push(3)` | `[3]` | `null` |
> | `push(2)` | `[2, 3]` (top first) | `null` |
> | `top()` | `[2, 3]` | `2` |
> | `getMax()` | `[2, 3]` | `3` |
> | `pop()` | `[3]` | `null` |
> | `getMax()` | `[3]` | `3` |
> | `push(5)` | `[5, 3]` | `null` |
> | `getMax()` | `[5, 3]` | `5` |

## Approach

Mirror image of MinStack. Maintain a running `max`. When a new max arrives, push the old max as a burial record, then the new value, and update max. When popping a value equal to the current max, also pop the buried record and restore max from it.

## Solution

<div class="lang-tabs">

```python,editable
import sys

class MaxStack:
    def __init__(self):
        self.stack = []
        self.max = -sys.maxsize

    def push(self, val: int) -> None:
        if val >= self.max:
            self.stack.append(self.max)        # burial record for old max
            self.max = val
        self.stack.append(val)

    def pop(self) -> None:
        top = self.stack.pop()
        if top == self.max:
            self.max = self.stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMax(self) -> int:
        return self.max

# Boss-fight demo
s = MaxStack()
s.push(3); s.push(2)
print(s.top())     # 2
print(s.getMax())  # 3
s.pop()
print(s.getMax())  # 3
s.push(5)
print(s.getMax())  # 5
```

```java,editable
import java.util.*;
public class Main {
    static class MaxStack {
        private final Deque<Integer> stack = new ArrayDeque<>();
        private int max = Integer.MIN_VALUE;

        public void push(int val) {
            if (val >= max) { stack.push(max); max = val; }
            stack.push(val);
        }
        public void pop() {
            int top = stack.pop();
            if (top == max) max = stack.pop();
        }
        public int top()    { return stack.peek(); }
        public int getMax() { return max; }
    }
    public static void main(String[] args) {
        MaxStack s = new MaxStack();
        s.push(3); s.push(2);
        System.out.println(s.top());
        System.out.println(s.getMax());
        s.pop();
        System.out.println(s.getMax());
        s.push(5);
        System.out.println(s.getMax());
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

typedef struct {
    int *arr;
    int  capacity, top;
    int  max;
} MaxStack;

MaxStack* max_stack_new(void) {
    MaxStack *s = malloc(sizeof(*s));
    s->capacity = 256; s->arr = malloc(sizeof(int) * s->capacity);
    s->top = -1; s->max = INT_MIN;
    return s;
}
void max_stack_push(MaxStack *s, int val) {
    if (val >= s->max) { s->arr[++s->top] = s->max; s->max = val; }
    s->arr[++s->top] = val;
}
void max_stack_pop(MaxStack *s) {
    int top = s->arr[s->top--];
    if (top == s->max) s->max = s->arr[s->top--];
}
int  max_stack_top(MaxStack *s)    { return s->arr[s->top]; }
int  max_stack_get_max(MaxStack *s){ return s->max; }

int main() {
    MaxStack *s = max_stack_new();
    max_stack_push(s, 3); max_stack_push(s, 2);
    printf("%d\n", max_stack_top(s));
    printf("%d\n", max_stack_get_max(s));
    max_stack_pop(s);
    printf("%d\n", max_stack_get_max(s));
    max_stack_push(s, 5);
    printf("%d\n", max_stack_get_max(s));
}
```

```cpp,editable
#include <iostream>
#include <stack>
#include <climits>

class MaxStack {
    std::stack<int> stack;
    int             max = INT_MIN;
public:
    void push(int val) {
        if (val >= max) { stack.push(max); max = val; }
        stack.push(val);
    }
    void pop() {
        int top = stack.top(); stack.pop();
        if (top == max) { max = stack.top(); stack.pop(); }
    }
    int top()    { return stack.top(); }
    int getMax() { return max; }
};

int main() {
    MaxStack s;
    s.push(3); s.push(2);
    std::cout << s.top()    << "\n";
    std::cout << s.getMax() << "\n";
    s.pop();
    std::cout << s.getMax() << "\n";
    s.push(5);
    std::cout << s.getMax() << "\n";
}
```

```scala,editable
import scala.collection.mutable

class MaxStack {
  private val stack = mutable.Stack[Int]()
  private var max   = Int.MinValue

  def push(v: Int): Unit = {
    if (v >= max) { stack.push(max); max = v }
    stack.push(v)
  }
  def pop(): Unit = {
    val top = stack.pop()
    if (top == max) max = stack.pop()
  }
  def top:    Int = stack.top
  def getMax: Int = max
}
object Main extends App {
  val s = new MaxStack
  s.push(3); s.push(2)
  println(s.top); println(s.getMax)
  s.pop()
  println(s.getMax)
  s.push(5)
  println(s.getMax)
}
```

```javascript,editable
class MaxStack {
    constructor() {
        this.stack = [];
        this.max   = Number.MIN_SAFE_INTEGER;
    }
    push(val) {
        if (val >= this.max) { this.stack.push(this.max); this.max = val; }
        this.stack.push(val);
    }
    pop() {
        const top = this.stack.pop();
        if (top === this.max) this.max = this.stack.pop();
    }
    top()    { return this.stack[this.stack.length - 1]; }
    getMax() { return this.max; }
}

const s = new MaxStack();
s.push(3); s.push(2);
console.log(s.top());
console.log(s.getMax());
s.pop();
console.log(s.getMax());
s.push(5);
console.log(s.getMax());
```

```typescript,editable
class MaxStack {
    private stack: number[] = [];
    private max:   number   = Number.MIN_SAFE_INTEGER;

    push(val: number): void {
        if (val >= this.max) { this.stack.push(this.max); this.max = val; }
        this.stack.push(val);
    }
    pop(): void {
        const top = this.stack.pop()!;
        if (top === this.max) this.max = this.stack.pop()!;
    }
    top():    number { return this.stack[this.stack.length - 1]; }
    getMax(): number { return this.max; }
}

const s = new MaxStack();
s.push(3); s.push(2);
console.log(s.top());
console.log(s.getMax());
s.pop();
console.log(s.getMax());
s.push(5);
console.log(s.getMax());
```

```go,editable
package main
import "fmt"
import "math"

type MaxStack struct {
    stack []int
    max   int
}

func NewMaxStack() *MaxStack { return &MaxStack{max: math.MinInt32} }

func (s *MaxStack) Push(val int) {
    if val >= s.max { s.stack = append(s.stack, s.max); s.max = val }
    s.stack = append(s.stack, val)
}
func (s *MaxStack) Pop() {
    top := s.stack[len(s.stack)-1]; s.stack = s.stack[:len(s.stack)-1]
    if top == s.max { s.max = s.stack[len(s.stack)-1]; s.stack = s.stack[:len(s.stack)-1] }
}
func (s *MaxStack) Top()    int { return s.stack[len(s.stack)-1] }
func (s *MaxStack) GetMax() int { return s.max }

func main() {
    s := NewMaxStack()
    s.Push(3); s.Push(2)
    fmt.Println(s.Top())
    fmt.Println(s.GetMax())
    s.Pop()
    fmt.Println(s.GetMax())
    s.Push(5)
    fmt.Println(s.GetMax())
}
```

```kotlin,editable
class MaxStack {
    private val stack = ArrayDeque<Int>()
    private var max   = Int.MIN_VALUE

    fun push(v: Int) {
        if (v >= max) { stack.addLast(max); max = v }
        stack.addLast(v)
    }
    fun pop() {
        val top = stack.removeLast()
        if (top == max) max = stack.removeLast()
    }
    fun top():    Int = stack.last()
    fun getMax(): Int = max
}

fun main() {
    val s = MaxStack()
    s.push(3); s.push(2)
    println(s.top()); println(s.getMax())
    s.pop()
    println(s.getMax())
    s.push(5)
    println(s.getMax())
}
```

```rust,editable
pub struct MaxStack {
    stack: Vec<i32>,
    max:   i32,
}

impl MaxStack {
    pub fn new() -> Self { MaxStack { stack: Vec::new(), max: i32::MIN } }

    pub fn push(&mut self, val: i32) {
        if val >= self.max { self.stack.push(self.max); self.max = val; }
        self.stack.push(val);
    }
    pub fn pop(&mut self) {
        let top = self.stack.pop().unwrap();
        if top == self.max { self.max = self.stack.pop().unwrap(); }
    }
    pub fn top(&self)     -> i32 { *self.stack.last().unwrap() }
    pub fn get_max(&self) -> i32 { self.max }
}

fn main() {
    let mut s = MaxStack::new();
    s.push(3); s.push(2);
    println!("{}", s.top());
    println!("{}", s.get_max());
    s.pop();
    println!("{}", s.get_max());
    s.push(5);
    println!("{}", s.get_max());
}
```

</div>

***

## Final Takeaway

Three lessons:

1. **One auxiliary integer + one stack = O(1) min/max.** No second stack required. The trick is to *bury* the previous extremum value just below every new-extremum value in the same stack.
2. **The trigger for "restore" is `top == current_min`.** When you pop and the popped value equals the current min, you know there's a saved record one slot below — pop it and restore. If the popped value isn't the current min, no extra work needed.
3. **The two-stack approach exists too.** A parallel stack of "running mins" works and is more obvious. We chose the single-stack version because the constraint demanded it, and because it teaches the deeper compositional move: encoding metadata *into* the existing structure rather than alongside it.

> **The complete arc — twelve lessons, one section, one data structure:**
>
> | Lesson | What you got | Why it mattered |
> |---|---|---|
> | 1 — Introduction | LIFO, push/pop semantics, real-world examples | Foundation |
> | 2 — Array implementation | O(1) per op via index = top tracking | Cache-friendly default |
> | 3 — Linked-list implementation | O(1) per op via head insertion | Unbounded growth |
> | 4 — Notations | Infix vs. postfix vs. prefix | Parser foundations |
> | 5 — Evaluating | Postfix evaluator, prefix evaluator, infix wrapper | The calculator |
> | 6 — Converting | Six conversions, Shunting-Yard | The compiler front-end |
> | 7 — Reversal | The simplest stack pattern | Gateway |
> | 8 — Previous closest | Monotonic stack | Stock span, histogram, ... |
> | 9 — Next closest | Same machinery, retroactive resolution | Daily temperatures, rainwater, histogram |
> | 10 — Sequence validation | Stack as matching memory | Brackets, palindromes, balance |
> | 11 — Linear evaluation | Push-pop-fold composition | Path simplification, decoding, parsing |
> | 12 — Design | Compose stack with auxiliary state | Min/Max stack |
>
> You started knowing a stack was a "list with restricted operations". You leave knowing it's the universal tool for *deferred work* — anywhere recency matters, anywhere most-recent-first is the right priority, anywhere parsers nest, anywhere "remember this until I find its match" comes up. Carry the toolkit. Every interview, every parser, every undo-redo system, every CPU you'll ever read assembly for — they all live or die by stacks.
