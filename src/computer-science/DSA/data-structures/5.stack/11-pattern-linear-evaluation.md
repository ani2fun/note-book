# 11. Pattern: Linear Evaluation

## The Hook

You're parsing a UNIX path like `/a/./b/../c/d`. The brain processing it does a single left-to-right scan: push `a`, ignore `.`, push `b`, see `..` → pop `b`, push `c`, push `d` → final path `/a/c/d`. The decoder for `2[ab3[c]]` in a string-expansion problem? Same thing: push characters, on `]` pop until `[`, multiply by the number before `[`, push the expanded string. A chemical formula `H(N(KO)2)3`? Same again: push atoms/groups, on `)` flatten the group, multiply by the trailing number, push back.

The unifying pattern: **as you scan, you build up sub-results on a stack; whenever a "closer" event fires, you pop a chunk, transform it, and push the transformation back as a new single unit on top of the stack.** The stack holds *partial answers in progress*; closer events trigger *evaluation* of one partial answer; the final stack contents (read top-to-bottom or bottom-to-top depending on the problem) is the answer.

This is the **linear evaluation** pattern. It's the most general of the stack patterns and the one that shows up in every interpreter, every nested-format parser, and every "decode this weird notation" interview question. Four problems below take you from the simplest case (path simplification with a single delimiter) to the most subtle (chemical-formula parsing with nested groups and multipliers).

---

## Table of contents

1. [Understanding the evaluation pattern](#understanding-the-evaluation-pattern)
2. [Identifying the linear evaluation pattern](#identifying-the-linear-evaluation-pattern)
3. [Canonicalise path](#canonicalise-path)
4. [Bracketed Reversal](#bracketed-reversal)
5. [String expansion](#string-expansion)
6. [Formula parsing](#formula-parsing)

***

# Understanding the evaluation pattern

Three primitive operations:

- **Push** a token (operand, marker, or partial result) onto the stack.
- **Trigger** evaluation when a "closer" event fires (e.g., `]`, `)`, `..`, end-of-token).
- **Combine** the popped chunk into a single new value and push it back onto the stack.

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
    R["read token"] --> Q{"closer event?"}
    Q -->|"no"| P["push token<br/>(or accumulate into top)"]
    Q -->|"yes"| TRIG["pop until matching opener<br/>(or condition)"]
    TRIG --> EVAL["combine popped pieces<br/>into one new value"]
    EVAL --> PUSH["push the combined value"]
    P --> R
    PUSH --> R
```

<p align="center"><strong>Linear evaluation — every input token either pushes a new partial result or triggers a "fold" of recently pushed parts into one combined result. The stack always holds a list of partial answers; the closer event collapses some of them.</strong></p>

## Algorithm

> **Algorithm**
>
> -   **Step 1:** Initialise an empty stack.
> -   **Step 2:** For each token in the input:
>     -   Decide its kind (operand, opener, closer, multiplier, …).
>     -   Push directly, or pop-and-combine, depending on the kind.
> -   **Step 3:** After the scan, the stack holds the answer (often joined or summed across remaining elements).

***

# Identifying the linear evaluation pattern

Look for problems with all three of these:

1. **Single linear scan over a string or sequence.**
2. **Nesting** — sub-expressions can contain sub-sub-expressions, recursively.
3. **A "closer" token** that triggers reducing a chunk of the stack into one result.

If the input is a flat list with no nesting, you don't need this pattern. But anywhere brackets, paths, encoded substrings, or grouping operators appear, the linear-evaluation stack lights up.

***

# Canonicalise path

## Problem Statement

Given an absolute UNIX-style path string, return its canonical form.

> -   `.` (dot) → current directory, ignored.
> -   `..` (double-dot) → parent directory, removes the last directory.
> -   `//` (multiple slashes) → treated as a single slash.
> -   Anything else is a directory name.

The output must:
- Begin with exactly one `/`.
- Have single-slash separators.
- Have no trailing slash (except for the root `/`).
- Have no `.` or `..`.

### Example 1
> -   **Input:** `/a/b/../c` → **Output:** `/a/c`

### Example 2
> -   **Input:** `/a/./../c` → **Output:** `/c`

### Example 3
> -   **Input:** `/a//b/c/../` → **Output:** `/a/b`

## Approach

Split on `/`. Each non-empty token is one of three things:

- `.` → ignore.
- `..` → pop the stack (move up one directory). If empty, do nothing (already at root).
- anything else → push as a directory name.

Final path = `/` + `'/'.join(stack)` (or just `/` if empty).

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
    A["/a/b/../c"] -->|"split"| B["[a, b, .., c]"]
    B --> C["scan tokens"]
    C --> S1["push 'a' → [a]"]
    S1 --> S2["push 'b' → [a, b]"]
    S2 --> S3["'..' → pop → [a]"]
    S3 --> S4["push 'c' → [a, c]"]
    S4 --> R["join → '/a/c'"]
    style R fill:#dcfce7,stroke:#22c55e
```

<p align="center"><strong>Canonicalise path — each token decides its action: push, pop, or skip. The final stack <em>is</em> the path's directory list, joined with slashes.</strong></p>

## Solution

<div class="lang-tabs">

```pseudocode
function canonicalisePath(path):
    stack ← empty
    for each token in split(path, '/'):
        if token = '' OR token = '.': continue
        if token = '..': if stack not empty: pop
        else: push token
    return '/' + join(stack, '/')
```

```python,editable
def canonicalise_path(path: str) -> str:
    stack = []
    for token in path.split('/'):
        if token == '' or token == '.':
            continue                           # skip empty or "."
        if token == '..':
            if stack: stack.pop()              # parent directory
        else:
            stack.append(token)
    return '/' + '/'.join(stack)

print(canonicalise_path("/a/b/../c"))      # /a/c
print(canonicalise_path("/a/./../c"))       # /c
print(canonicalise_path("/a//b/c/../"))     # /a/b
```

```java,editable
import java.util.*;
public class Main {
    static String canonicalisePath(String path) {
        Deque<String> st = new ArrayDeque<>();
        for (String token : path.split("/")) {
            if (token.isEmpty() || token.equals(".")) continue;
            if (token.equals("..")) { if (!st.isEmpty()) st.pop(); }
            else st.push(token);
        }
        StringBuilder out = new StringBuilder();
        Iterator<String> it = st.descendingIterator();
        while (it.hasNext()) { out.append('/').append(it.next()); }
        return out.length() == 0 ? "/" : out.toString();
    }
    public static void main(String[] args) {
        System.out.println(canonicalisePath("/a/b/../c"));
        System.out.println(canonicalisePath("/a/./../c"));
        System.out.println(canonicalisePath("/a//b/c/../"));
    }
}
```

```c,editable
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void canonicalise_path(const char *path, char *out) {
    char *st[256]; int top = -1;
    char buf[1024]; strncpy(buf, path, sizeof(buf)-1); buf[sizeof(buf)-1]=0;
    char *tok = strtok(buf, "/");
    while (tok) {
        if (strcmp(tok, ".") == 0) { /* skip */ }
        else if (strcmp(tok, "..") == 0) { if (top >= 0) top--; }
        else st[++top] = tok;
        tok = strtok(NULL, "/");
    }
    if (top < 0) { strcpy(out, "/"); return; }
    int o = 0;
    for (int i = 0; i <= top; i++) { out[o++] = '/'; int l = (int)strlen(st[i]); memcpy(out+o, st[i], l); o += l; }
    out[o] = 0;
}

int main() {
    char buf[256];
    canonicalise_path("/a/b/../c", buf);    printf("%s\n", buf);
    canonicalise_path("/a/./../c", buf);    printf("%s\n", buf);
    canonicalise_path("/a//b/c/../", buf);  printf("%s\n", buf);
}
```

```cpp,editable
#include <iostream>
#include <sstream>
#include <vector>
#include <string>

std::string canonicalisePath(const std::string &path) {
    std::vector<std::string> st;
    std::stringstream ss(path); std::string tok;
    while (std::getline(ss, tok, '/')) {
        if (tok.empty() || tok == ".") continue;
        if (tok == "..") { if (!st.empty()) st.pop_back(); }
        else st.push_back(tok);
    }
    if (st.empty()) return "/";
    std::string out;
    for (auto &d : st) { out += "/" + d; }
    return out;
}

int main() {
    std::cout << canonicalisePath("/a/b/../c")    << "\n";
    std::cout << canonicalisePath("/a/./../c")    << "\n";
    std::cout << canonicalisePath("/a//b/c/../")  << "\n";
}
```

```scala,editable
import scala.collection.mutable
def canonicalisePath(path: String): String = {
  val st = mutable.ArrayBuffer[String]()
  for (tok <- path.split("/")) {
    if (tok.isEmpty || tok == ".") {}
    else if (tok == "..") { if (st.nonEmpty) st.remove(st.length - 1) }
    else st.append(tok)
  }
  if (st.isEmpty) "/" else "/" + st.mkString("/")
}
object Main extends App {
  println(canonicalisePath("/a/b/../c"))
  println(canonicalisePath("/a/./../c"))
  println(canonicalisePath("/a//b/c/../"))
}
```

```typescript,editable
function canonicalisePath(path: string): string {
    const st: string[] = [];
    for (const tok of path.split('/')) {
        if (tok === '' || tok === '.') continue;
        if (tok === '..') { if (st.length) st.pop(); }
        else st.push(tok);
    }
    return '/' + st.join('/');
}
console.log(canonicalisePath("/a/b/../c"));
console.log(canonicalisePath("/a/./../c"));
console.log(canonicalisePath("/a//b/c/../"));
```

```go,editable
package main
import (
    "fmt"
    "strings"
)
func canonicalisePath(path string) string {
    st := []string{}
    for _, tok := range strings.Split(path, "/") {
        switch tok {
            case "", ".": continue
            case "..": if len(st) > 0 { st = st[:len(st)-1] }
            default: st = append(st, tok)
        }
    }
    if len(st) == 0 { return "/" }
    return "/" + strings.Join(st, "/")
}
func main() {
    fmt.Println(canonicalisePath("/a/b/../c"))
    fmt.Println(canonicalisePath("/a/./../c"))
    fmt.Println(canonicalisePath("/a//b/c/../"))
}
```

```rust,editable
fn canonicalise_path(path: &str) -> String {
    let mut st: Vec<&str> = Vec::new();
    for tok in path.split('/') {
        match tok {
            "" | "." => continue,
            ".." => { st.pop(); }
            _ => st.push(tok),
        }
    }
    if st.is_empty() { "/".to_string() }
    else { format!("/{}", st.join("/")) }
}
fn main() {
    println!("{}", canonicalise_path("/a/b/../c"));
    println!("{}", canonicalise_path("/a/./../c"));
    println!("{}", canonicalise_path("/a//b/c/../"));
}
```

</div>

***

# Bracketed Reversal

## Problem Statement

Given a string of letters and `[`/`]` brackets, **reverse the substring inside each pair of brackets** and return the result. Brackets nest.

### Example 1
> -   **Input:** `s = "a[bcd]e"` → **Output:** `"adcbe"`

### Example 2
> -   **Input:** `s = "abcd[ef[gh]i]j"` → **Output:** `"abcdihgfej"`

### Example 3
> -   **Input:** `s = "abcdefghij"` → **Output:** `"abcdefghij"`

## Approach

Push characters and `[` onto a stack. On `]`, pop characters until you hit `[` — but **append them as you pop**, which builds the reversed substring naturally. Pop the `[`, push the reversed substring back as a single string token. Final answer = concatenate the stack bottom-to-top.

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
    R["read char"] --> Q{"type?"}
    Q -->|"letter or '['"| P["push as string"]
    Q -->|"']'"| EVAL["pop chars until '['<br/>(append as you pop = reversed)<br/>discard '['<br/>push reversed string"]
    P --> R; EVAL --> R
    R -->|"end"| OUT["concatenate stack bottom-to-top"]
```

<p align="center"><strong>Bracketed reversal — popping while appending naturally builds the reversed substring (the topmost char comes out first and goes to the front of the result).</strong></p>

## Solution

<div class="lang-tabs">

```pseudocode
function bracketedReversal(s):
    stack ← empty
    for each ch in s:
        if ch = ']':
            rev ← ""
            while top ≠ '[': rev ← rev + pop()   # popping top-first builds reversed string
            pop                                    # discard '['
            push rev
        else: push ch
    return join(stack)
```

```python,editable
def bracketed_reversal(s: str) -> str:
    stack = []
    for ch in s:
        if ch == ']':
            reversed_str = ""
            while stack and stack[-1] != '[':
                reversed_str += stack.pop()    # pop = top first → reversed
            if stack: stack.pop()              # discard '['
            stack.append(reversed_str)
        else:
            stack.append(ch)
    return ''.join(stack)

print(bracketed_reversal("a[bcd]e"))         # adcbe
print(bracketed_reversal("abcd[ef[gh]i]j"))  # abcdihgfej
print(bracketed_reversal("abcdefghij"))      # abcdefghij
```

```java,editable
import java.util.*;
public class Main {
    static String bracketedReversal(String s) {
        Deque<String> st = new ArrayDeque<>();
        for (char ch : s.toCharArray()) {
            if (ch == ']') {
                StringBuilder rev = new StringBuilder();
                while (!st.isEmpty() && !st.peek().equals("[")) rev.append(st.pop());
                if (!st.isEmpty()) st.pop();
                st.push(rev.toString());
            } else st.push(String.valueOf(ch));
        }
        StringBuilder out = new StringBuilder();
        Iterator<String> it = st.descendingIterator();
        while (it.hasNext()) out.append(it.next());
        return out.toString();
    }
    public static void main(String[] args) {
        System.out.println(bracketedReversal("a[bcd]e"));
        System.out.println(bracketedReversal("abcd[ef[gh]i]j"));
        System.out.println(bracketedReversal("abcdefghij"));
    }
}
```

```c,editable
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

char *bracketed_reversal(const char *s) {
    char *st[256]; int top = -1;
    for (; *s; s++) {
        if (*s == ']') {
            char *rev = malloc(256); int r = 0;
            while (top >= 0 && strcmp(st[top], "[") != 0) {
                int l = (int)strlen(st[top]);
                for (int k = l-1; k >= 0; k--) rev[r++] = st[top][k];
                free(st[top]); top--;
            }
            rev[r] = 0;
            if (top >= 0) { free(st[top]); top--; }
            st[++top] = rev;
        } else {
            char *cs = malloc(2); cs[0] = *s; cs[1] = 0;
            st[++top] = cs;
        }
    }
    int total = 0;
    for (int i = 0; i <= top; i++) total += (int)strlen(st[i]);
    char *out = malloc(total + 1); int o = 0;
    for (int i = 0; i <= top; i++) {
        int l = (int)strlen(st[i]);
        memcpy(out + o, st[i], l); o += l;
        free(st[i]);
    }
    out[o] = 0;
    return out;
}

int main() {
    char *r;
    r = bracketed_reversal("a[bcd]e"); printf("%s\n", r); free(r);
    r = bracketed_reversal("abcd[ef[gh]i]j"); printf("%s\n", r); free(r);
    r = bracketed_reversal("abcdefghij"); printf("%s\n", r); free(r);
}
```

```cpp,editable
#include <iostream>
#include <stack>
#include <string>

std::string bracketedReversal(const std::string &s) {
    std::stack<std::string> st;
    for (char ch : s) {
        if (ch == ']') {
            std::string rev;
            while (!st.empty() && st.top() != "[") { rev += st.top(); st.pop(); }
            if (!st.empty()) st.pop();
            st.push(rev);
        } else st.push(std::string(1, ch));
    }
    std::string out;
    while (!st.empty()) { out = st.top() + out; st.pop(); }
    return out;
}
int main() {
    std::cout << bracketedReversal("a[bcd]e")        << "\n";
    std::cout << bracketedReversal("abcd[ef[gh]i]j") << "\n";
    std::cout << bracketedReversal("abcdefghij")     << "\n";
}
```

```scala,editable
import scala.collection.mutable
def bracketedReversal(s: String): String = {
  val st = mutable.Stack[String]()
  for (ch <- s) {
    if (ch == ']') {
      val rev = new StringBuilder
      while (st.nonEmpty && st.top != "[") rev.append(st.pop())
      if (st.nonEmpty) st.pop()
      st.push(rev.toString)
    } else st.push(ch.toString)
  }
  st.reverseIterator.mkString
}
object Main extends App {
  println(bracketedReversal("a[bcd]e"))
  println(bracketedReversal("abcd[ef[gh]i]j"))
  println(bracketedReversal("abcdefghij"))
}
```

```typescript,editable
function bracketedReversal(s: string): string {
    const st: string[] = [];
    for (const ch of s) {
        if (ch === ']') {
            let rev = "";
            while (st.length && st[st.length-1] !== '[') rev += st.pop();
            if (st.length) st.pop();
            st.push(rev);
        } else st.push(ch);
    }
    return st.join('');
}
console.log(bracketedReversal("a[bcd]e"));
console.log(bracketedReversal("abcd[ef[gh]i]j"));
console.log(bracketedReversal("abcdefghij"));
```

```go,editable
package main
import "fmt"
import "strings"
func bracketedReversal(s string) string {
    st := []string{}
    for i := 0; i < len(s); i++ {
        ch := s[i]
        if ch == ']' {
            var sb strings.Builder
            for len(st) > 0 && st[len(st)-1] != "[" {
                sb.WriteString(st[len(st)-1]); st = st[:len(st)-1]
            }
            if len(st) > 0 { st = st[:len(st)-1] }
            st = append(st, sb.String())
        } else {
            st = append(st, string(ch))
        }
    }
    return strings.Join(st, "")
}
func main() {
    fmt.Println(bracketedReversal("a[bcd]e"))
    fmt.Println(bracketedReversal("abcd[ef[gh]i]j"))
    fmt.Println(bracketedReversal("abcdefghij"))
}
```

```rust,editable
fn bracketed_reversal(s: &str) -> String {
    let mut st: Vec<String> = Vec::new();
    for ch in s.chars() {
        if ch == ']' {
            let mut rev = String::new();
            while let Some(top) = st.last() {
                if top == "[" { break; }
                rev.push_str(&st.pop().unwrap());
            }
            if st.last().map(|s| s.as_str()) == Some("[") { st.pop(); }
            st.push(rev);
        } else {
            st.push(ch.to_string());
        }
    }
    st.join("")
}
fn main() {
    println!("{}", bracketed_reversal("a[bcd]e"));
    println!("{}", bracketed_reversal("abcd[ef[gh]i]j"));
    println!("{}", bracketed_reversal("abcdefghij"));
}
```

</div>

***

# String expansion

## Problem Statement

Given a string encoded with `k[substring]` notation (k a positive integer, substring possibly nested), return the decoded string. The encoding repeats the substring `k` times.

### Example 1
> -   **Input:** `"2[ab3[c]]"` → **Output:** `"abcccabccc"`

### Example 2
> -   **Input:** `"3[a]2[bc]"` → **Output:** `"aaabcbc"`

### Example 3
> -   **Input:** `"2[abc]3[cd]ef"` → **Output:** `"abcabccdcdcdef"`

## Approach

Same shape as bracketed reversal but the closer triggers a *repeat*, not a reverse. Push numbers (as strings), letters, and `[`. On `]`, pop the inner substring, pop the `[`, pop the repeat count (which is just before `[`), expand, push back.

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
    R["read char"] --> Q{"type?"}
    Q -->|"digit"| ND["push number<br/>(handle multi-digit)"]
    Q -->|"letter or '['"| P["push as string"]
    Q -->|"']'"| EVAL["pop chars until '['<br/>discard '['<br/>pop repeat count k<br/>push (substring × k)"]
    ND --> R; P --> R; EVAL --> R
```

<p align="center"><strong>String expansion — closer fires the substring×k folding. Multi-digit numbers (e.g. 12[ab]) are handled by reading consecutive digits before pushing the count as one string.</strong></p>

## Solution

<div class="lang-tabs">

```pseudocode
function stringExpansion(s):
    stack ← empty; i ← 0
    while i < length(s):
        if s[i] is digit:
            read full multi-digit number; push it; advance i
        else if s[i] = ']':
            inner ← collect tokens above '[' in original order; pop '['
            k     ← pop()              # repeat count pushed just before '['
            push (inner repeated k times)
            i ← i + 1
        else: push s[i]; i ← i + 1
    return join(stack)
```

```python,editable
def string_expansion(s: str) -> str:
    stack = []
    i = 0
    while i < len(s):
        if s[i].isdigit():
            j = i
            while j < len(s) and s[j].isdigit(): j += 1
            stack.append(s[i:j])
            i = j
        elif s[i] == ']':
            inner = ""
            while stack and stack[-1] != '[':
                inner = stack.pop() + inner       # build in original order
            if stack: stack.pop()                  # discard '['
            k = int(stack.pop())                   # the repeat count
            stack.append(inner * k)
            i += 1
        else:
            stack.append(s[i]); i += 1
    return ''.join(stack)

print(string_expansion("2[ab3[c]]"))      # abcccabccc
print(string_expansion("3[a]2[bc]"))      # aaabcbc
print(string_expansion("2[abc]3[cd]ef"))  # abcabccdcdcdef
```

```java,editable
import java.util.*;
public class Main {
    static String stringExpansion(String s) {
        Deque<String> st = new ArrayDeque<>();
        int i = 0;
        while (i < s.length()) {
            char ch = s.charAt(i);
            if (Character.isDigit(ch)) {
                int j = i;
                while (j < s.length() && Character.isDigit(s.charAt(j))) j++;
                st.push(s.substring(i, j));
                i = j;
            } else if (ch == ']') {
                StringBuilder inner = new StringBuilder();
                while (!st.isEmpty() && !st.peek().equals("[")) inner.insert(0, st.pop());
                if (!st.isEmpty()) st.pop();
                int k = Integer.parseInt(st.pop());
                StringBuilder expanded = new StringBuilder();
                for (int t = 0; t < k; t++) expanded.append(inner);
                st.push(expanded.toString());
                i++;
            } else {
                st.push(String.valueOf(ch));
                i++;
            }
        }
        StringBuilder out = new StringBuilder();
        Iterator<String> it = st.descendingIterator();
        while (it.hasNext()) out.append(it.next());
        return out.toString();
    }
    public static void main(String[] args) {
        System.out.println(stringExpansion("2[ab3[c]]"));
        System.out.println(stringExpansion("3[a]2[bc]"));
        System.out.println(stringExpansion("2[abc]3[cd]ef"));
    }
}
```

```c,editable
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>

char *string_expansion(const char *s) {
    char *st[256]; int top = -1; int n = (int)strlen(s);
    for (int i = 0; i < n; ) {
        char ch = s[i];
        if (isdigit((unsigned char)ch)) {
            int j = i; while (j < n && isdigit((unsigned char)s[j])) j++;
            char *num = malloc(j - i + 1); memcpy(num, s+i, j-i); num[j-i] = 0;
            st[++top] = num; i = j;
        } else if (ch == ']') {
            char inner[1024]; int p = 0;
            char *parts[256]; int pn = 0;
            while (top >= 0 && strcmp(st[top], "[") != 0) parts[pn++] = st[top--];
            for (int k = pn - 1; k >= 0; k--) { int l = (int)strlen(parts[k]); memcpy(inner+p, parts[k], l); p += l; free(parts[k]); }
            inner[p] = 0;
            if (top >= 0) { free(st[top]); top--; }
            int kk = atoi(st[top]); free(st[top--]);
            char *exp = malloc(p * kk + 1); int eo = 0;
            for (int t = 0; t < kk; t++) { memcpy(exp+eo, inner, p); eo += p; }
            exp[eo] = 0;
            st[++top] = exp;
            i++;
        } else {
            char *cs = malloc(2); cs[0] = ch; cs[1] = 0; st[++top] = cs; i++;
        }
    }
    int total = 0; for (int i = 0; i <= top; i++) total += (int)strlen(st[i]);
    char *out = malloc(total + 1); int o = 0;
    for (int i = 0; i <= top; i++) { int l = (int)strlen(st[i]); memcpy(out+o, st[i], l); o += l; free(st[i]); }
    out[o] = 0; return out;
}

int main() {
    char *r;
    r = string_expansion("2[ab3[c]]"); printf("%s\n", r); free(r);
    r = string_expansion("3[a]2[bc]"); printf("%s\n", r); free(r);
    r = string_expansion("2[abc]3[cd]ef"); printf("%s\n", r); free(r);
}
```

```cpp,editable
#include <iostream>
#include <stack>
#include <string>
#include <cctype>

std::string stringExpansion(const std::string &s) {
    std::stack<std::string> st;
    for (size_t i = 0; i < s.size(); ) {
        char ch = s[i];
        if (isdigit((unsigned char)ch)) {
            size_t j = i; while (j < s.size() && isdigit((unsigned char)s[j])) j++;
            st.push(s.substr(i, j - i));
            i = j;
        } else if (ch == ']') {
            std::string inner;
            while (!st.empty() && st.top() != "[") { inner = st.top() + inner; st.pop(); }
            if (!st.empty()) st.pop();
            int k = std::stoi(st.top()); st.pop();
            std::string exp; for (int t = 0; t < k; t++) exp += inner;
            st.push(exp);
            i++;
        } else { st.push(std::string(1, ch)); i++; }
    }
    std::string out;
    while (!st.empty()) { out = st.top() + out; st.pop(); }
    return out;
}
int main() {
    std::cout << stringExpansion("2[ab3[c]]")     << "\n";
    std::cout << stringExpansion("3[a]2[bc]")     << "\n";
    std::cout << stringExpansion("2[abc]3[cd]ef") << "\n";
}
```

```scala,editable
import scala.collection.mutable
def stringExpansion(s: String): String = {
  val st = mutable.Stack[String]()
  var i = 0
  while (i < s.length) {
    val ch = s(i)
    if (ch.isDigit) {
      var j = i; while (j < s.length && s(j).isDigit) j += 1
      st.push(s.substring(i, j)); i = j
    } else if (ch == ']') {
      val inner = new StringBuilder
      while (st.nonEmpty && st.top != "[") inner.insert(0, st.pop())
      if (st.nonEmpty) st.pop()
      val k = st.pop().toInt
      val exp = new StringBuilder
      for (_ <- 0 until k) exp.append(inner)
      st.push(exp.toString); i += 1
    } else { st.push(ch.toString); i += 1 }
  }
  st.reverseIterator.mkString
}
object Main extends App {
  println(stringExpansion("2[ab3[c]]"))
  println(stringExpansion("3[a]2[bc]"))
  println(stringExpansion("2[abc]3[cd]ef"))
}
```

```typescript,editable
function stringExpansion(s: string): string {
    const st: string[] = [];
    let i = 0;
    while (i < s.length) {
        const ch = s[i];
        if (/\d/.test(ch)) {
            let j = i; while (j < s.length && /\d/.test(s[j])) j++;
            st.push(s.slice(i, j)); i = j;
        } else if (ch === ']') {
            let inner = "";
            while (st.length && st[st.length-1] !== '[') inner = st.pop()! + inner;
            if (st.length) st.pop();
            const k = parseInt(st.pop()!, 10);
            st.push(inner.repeat(k));
            i++;
        } else { st.push(ch); i++; }
    }
    return st.join('');
}
console.log(stringExpansion("2[ab3[c]]"));
console.log(stringExpansion("3[a]2[bc]"));
console.log(stringExpansion("2[abc]3[cd]ef"));
```

```go,editable
package main
import (
    "fmt"
    "strconv"
    "strings"
    "unicode"
)
func stringExpansion(s string) string {
    st := []string{}
    i := 0
    for i < len(s) {
        ch := rune(s[i])
        if unicode.IsDigit(ch) {
            j := i
            for j < len(s) && unicode.IsDigit(rune(s[j])) { j++ }
            st = append(st, s[i:j]); i = j
        } else if ch == ']' {
            inner := ""
            for len(st) > 0 && st[len(st)-1] != "[" { inner = st[len(st)-1] + inner; st = st[:len(st)-1] }
            if len(st) > 0 { st = st[:len(st)-1] }
            k, _ := strconv.Atoi(st[len(st)-1]); st = st[:len(st)-1]
            st = append(st, strings.Repeat(inner, k))
            i++
        } else { st = append(st, string(ch)); i++ }
    }
    return strings.Join(st, "")
}
func main() {
    fmt.Println(stringExpansion("2[ab3[c]]"))
    fmt.Println(stringExpansion("3[a]2[bc]"))
    fmt.Println(stringExpansion("2[abc]3[cd]ef"))
}
```

```rust,editable
fn string_expansion(s: &str) -> String {
    let bytes = s.as_bytes();
    let mut st: Vec<String> = Vec::new();
    let mut i = 0;
    while i < bytes.len() {
        let ch = bytes[i] as char;
        if ch.is_ascii_digit() {
            let mut j = i;
            while j < bytes.len() && (bytes[j] as char).is_ascii_digit() { j += 1; }
            st.push(s[i..j].to_string()); i = j;
        } else if ch == ']' {
            let mut inner = String::new();
            while let Some(top) = st.last() {
                if top == "[" { break; }
                let popped = st.pop().unwrap();
                inner = popped + &inner;
            }
            if st.last().map(|s| s.as_str()) == Some("[") { st.pop(); }
            let k: usize = st.pop().unwrap().parse().unwrap();
            st.push(inner.repeat(k));
            i += 1;
        } else { st.push(ch.to_string()); i += 1; }
    }
    st.join("")
}
fn main() {
    println!("{}", string_expansion("2[ab3[c]]"));
    println!("{}", string_expansion("3[a]2[bc]"));
    println!("{}", string_expansion("2[abc]3[cd]ef"));
}
```

</div>

***

# Formula parsing

## Problem Statement

Given a chemical formula consisting of single-uppercase atoms (e.g. `H`, `O`), positive-integer multipliers, and parentheses for grouping, return a string of `ATOM:COUNT` separated by spaces, in order of first appearance.

> Single-uppercase atoms only (no `Na`, no `Cl` — atoms here are one character each), and no atom appears twice in the input.

### Example 1
> -   **Input:** `"(HO)2"` → **Output:** `"H:2 O:2"`

### Example 2
> -   **Input:** `"H(N(KO)2)3"` → **Output:** `"H:1 N:3 K:6 O:6"`

### Example 3
> -   **Input:** `"KH"` → **Output:** `"K:1 H:1"`

## Approach

Stack of `(name, count)` records, plus a special `(` marker. On `(`: push a marker. On atom: read its trailing count (default 1) and push. On `)`: read the multiplier, pop everything down to the `(` marker, multiply each popped count by the multiplier, push back.

The "first appearance order" requirement is satisfied because we never re-order: by tracking each atom's earliest index in a separate map, we can sort the final stack by that.

## Solution

<div class="lang-tabs">

```pseudocode
function formulaParsing(formula):
    stack ← empty; firstSeen ← []; i ← 0
    while i < length(formula):
        ch ← formula[i]
        if ch = '(': push ('(', −1); i ← i + 1
        else if ch = ')':
            i ← i + 1; mult ← read multi-digit number (default 1)
            group ← pop all entries above '(' marker; pop '('
            for each (atom, cnt) in group: push (atom, cnt * mult)
        else if ch is uppercase letter:
            atom ← ch; i ← i + 1; cnt ← read multi-digit number (default 1)
            record first-seen order; push (atom, cnt)
        else: i ← i + 1
    aggregate counts per atom; sort by first-seen order
    return "A:count B:count …"
```

```python,editable
def formula_parsing(formula: str) -> str:
    stack = [('(', -1)]                  # sentinel; never used
    stack.pop()                          # ... actually keep it clean
    i = 0; n = len(formula)
    first_seen = {}                       # atom → order of first appearance
    order_counter = 0
    while i < n:
        ch = formula[i]
        if ch == '(':
            stack.append(('(', -1)); i += 1
        elif ch == ')':
            i += 1
            mult = 0
            while i < n and formula[i].isdigit():
                mult = mult * 10 + int(formula[i]); i += 1
            if mult == 0: mult = 1
            group = []
            while stack and stack[-1][0] != '(':
                group.append(stack.pop())
            if stack: stack.pop()         # discard '('
            for atom, cnt in reversed(group):
                stack.append((atom, cnt * mult))
        elif ch.isupper():
            atom = ch; i += 1
            cnt = 0
            while i < n and formula[i].isdigit():
                cnt = cnt * 10 + int(formula[i]); i += 1
            if cnt == 0: cnt = 1
            if atom not in first_seen:
                first_seen[atom] = order_counter; order_counter += 1
            stack.append((atom, cnt))
        else: i += 1
    # Aggregate (input guarantees each atom appears once before grouping, but
    # multiplications may accumulate the same atom across the stack)
    totals = {}
    for atom, cnt in stack:
        totals[atom] = totals.get(atom, 0) + cnt
    parts = sorted(totals.items(), key=lambda kv: first_seen[kv[0]])
    return ' '.join(f"{a}:{c}" for a, c in parts)

print(formula_parsing("(HO)2"))         # H:2 O:2
print(formula_parsing("H(N(KO)2)3"))    # H:1 N:3 K:6 O:6
print(formula_parsing("KH"))             # K:1 H:1
```

```java,editable
import java.util.*;
public class Main {
    static String formulaParsing(String formula) {
        Deque<int[]> st = new ArrayDeque<>();   // [atomCharCode (-1 for marker), count]
        Map<Character, Integer> firstSeen = new LinkedHashMap<>();
        int n = formula.length(), i = 0;
        while (i < n) {
            char ch = formula.charAt(i);
            if (ch == '(') { st.push(new int[]{-1, -1}); i++; }
            else if (ch == ')') {
                i++;
                int mult = 0;
                while (i < n && Character.isDigit(formula.charAt(i))) { mult = mult * 10 + (formula.charAt(i) - '0'); i++; }
                if (mult == 0) mult = 1;
                List<int[]> group = new ArrayList<>();
                while (!st.isEmpty() && st.peek()[0] != -1) group.add(st.pop());
                if (!st.isEmpty()) st.pop();
                for (int j = group.size() - 1; j >= 0; j--) {
                    int[] a = group.get(j); st.push(new int[]{a[0], a[1] * mult});
                }
            } else if (Character.isUpperCase(ch)) {
                char atom = ch; i++;
                int cnt = 0;
                while (i < n && Character.isDigit(formula.charAt(i))) { cnt = cnt * 10 + (formula.charAt(i) - '0'); i++; }
                if (cnt == 0) cnt = 1;
                firstSeen.putIfAbsent(atom, firstSeen.size());
                st.push(new int[]{atom, cnt});
            } else i++;
        }
        Map<Character, Integer> totals = new HashMap<>();
        for (int[] e : st) totals.merge((char)e[0], e[1], Integer::sum);
        StringBuilder out = new StringBuilder();
        for (Character a : firstSeen.keySet()) {
            if (out.length() > 0) out.append(' ');
            out.append(a).append(':').append(totals.get(a));
        }
        return out.toString();
    }
    public static void main(String[] args) {
        System.out.println(formulaParsing("(HO)2"));
        System.out.println(formulaParsing("H(N(KO)2)3"));
        System.out.println(formulaParsing("KH"));
    }
}
```

```c,editable
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <stdlib.h>

typedef struct { char name; int count; } Atom;

void formula_parsing(const char *f, char *out) {
    Atom st[1024]; int top = -1;
    char order[64]; int order_n = 0;
    int seen[256] = {0};
    int total[256] = {0};
    int n = (int)strlen(f); int i = 0;
    while (i < n) {
        char ch = f[i];
        if (ch == '(') { st[++top] = (Atom){'(', -1}; i++; }
        else if (ch == ')') {
            i++;
            int mult = 0;
            while (i < n && isdigit((unsigned char)f[i])) { mult = mult*10 + (f[i] - '0'); i++; }
            if (mult == 0) mult = 1;
            int gtop = top; int gstart = top;
            while (gstart >= 0 && st[gstart].name != '(') gstart--;
            for (int k = gstart + 1; k <= top; k++) st[k].count *= mult;
            // remove the '(' marker
            for (int k = gstart; k < top; k++) st[k] = st[k+1];
            top--;
        } else if (isupper((unsigned char)ch)) {
            char atom = ch; i++;
            int cnt = 0;
            while (i < n && isdigit((unsigned char)f[i])) { cnt = cnt*10 + (f[i] - '0'); i++; }
            if (cnt == 0) cnt = 1;
            if (!seen[(int)atom]) { seen[(int)atom] = 1; order[order_n++] = atom; }
            st[++top] = (Atom){atom, cnt};
        } else i++;
    }
    for (int k = 0; k <= top; k++) total[(int)st[k].name] += st[k].count;
    int o = 0;
    for (int k = 0; k < order_n; k++) {
        if (k > 0) out[o++] = ' ';
        o += sprintf(out + o, "%c:%d", order[k], total[(int)order[k]]);
    }
    out[o] = 0;
}

int main() {
    char buf[256];
    formula_parsing("(HO)2", buf);       printf("%s\n", buf);
    formula_parsing("H(N(KO)2)3", buf);  printf("%s\n", buf);
    formula_parsing("KH", buf);          printf("%s\n", buf);
}
```

```cpp,editable
#include <iostream>
#include <stack>
#include <vector>
#include <map>
#include <cctype>

struct Atom { char name; int count; };

std::string formulaParsing(const std::string &f) {
    std::stack<Atom> st;
    std::vector<char> order;
    std::map<char, bool> seen;
    int n = (int)f.size(), i = 0;
    while (i < n) {
        char ch = f[i];
        if (ch == '(') { st.push({'(', -1}); i++; }
        else if (ch == ')') {
            i++;
            int mult = 0;
            while (i < n && isdigit((unsigned char)f[i])) { mult = mult*10 + (f[i]-'0'); i++; }
            if (mult == 0) mult = 1;
            std::vector<Atom> group;
            while (!st.empty() && st.top().name != '(') { group.push_back(st.top()); st.pop(); }
            if (!st.empty()) st.pop();
            for (auto it = group.rbegin(); it != group.rend(); ++it) st.push({it->name, it->count * mult});
        } else if (isupper((unsigned char)ch)) {
            char atom = ch; i++;
            int cnt = 0;
            while (i < n && isdigit((unsigned char)f[i])) { cnt = cnt*10 + (f[i]-'0'); i++; }
            if (cnt == 0) cnt = 1;
            if (!seen[atom]) { seen[atom] = true; order.push_back(atom); }
            st.push({atom, cnt});
        } else i++;
    }
    std::map<char, int> total;
    while (!st.empty()) { total[st.top().name] += st.top().count; st.pop(); }
    std::string out;
    for (char c : order) { if (!out.empty()) out += ' '; out += c; out += ':'; out += std::to_string(total[c]); }
    return out;
}
int main() {
    std::cout << formulaParsing("(HO)2")      << "\n";
    std::cout << formulaParsing("H(N(KO)2)3") << "\n";
    std::cout << formulaParsing("KH")          << "\n";
}
```

```scala,editable
import scala.collection.mutable
def formulaParsing(f: String): String = {
  val st = mutable.Stack[(Char, Int)]()
  val order = mutable.ArrayBuffer[Char]()
  val seen  = mutable.Set[Char]()
  var i = 0
  while (i < f.length) {
    val ch = f(i)
    if (ch == '(') { st.push(('(', -1)); i += 1 }
    else if (ch == ')') {
      i += 1
      var mult = 0
      while (i < f.length && f(i).isDigit) { mult = mult * 10 + (f(i) - '0'); i += 1 }
      if (mult == 0) mult = 1
      val grp = mutable.ArrayBuffer[(Char, Int)]()
      while (st.nonEmpty && st.top._1 != '(') grp.append(st.pop())
      if (st.nonEmpty) st.pop()
      for (j <- grp.indices.reverse) { val (a, c) = grp(j); st.push((a, c * mult)) }
    } else if (ch.isUpper) {
      val atom = ch; i += 1
      var cnt = 0
      while (i < f.length && f(i).isDigit) { cnt = cnt * 10 + (f(i) - '0'); i += 1 }
      if (cnt == 0) cnt = 1
      if (!seen(atom)) { seen.add(atom); order.append(atom) }
      st.push((atom, cnt))
    } else i += 1
  }
  val total = mutable.Map[Char, Int]().withDefaultValue(0)
  while (st.nonEmpty) { val (a, c) = st.pop(); total(a) += c }
  order.map(a => s"$a:${total(a)}").mkString(" ")
}
object Main extends App {
  println(formulaParsing("(HO)2"))
  println(formulaParsing("H(N(KO)2)3"))
  println(formulaParsing("KH"))
}
```

```typescript,editable
function formulaParsing(f: string): string {
    const st: [string, number][] = [];
    const order: string[] = []; const seen = new Set<string>();
    let i = 0, n = f.length;
    while (i < n) {
        const ch = f[i];
        if (ch === '(') { st.push(['(', -1]); i++; }
        else if (ch === ')') {
            i++;
            let mult = 0;
            while (i < n && /\d/.test(f[i])) { mult = mult*10 + Number(f[i]); i++; }
            if (mult === 0) mult = 1;
            const grp: [string, number][] = [];
            while (st.length && st[st.length-1][0] !== '(') grp.push(st.pop()!);
            if (st.length) st.pop();
            for (let j = grp.length - 1; j >= 0; j--) {
                const [a, c] = grp[j]; st.push([a, c * mult]);
            }
        } else if (/[A-Z]/.test(ch)) {
            const atom = ch; i++;
            let cnt = 0;
            while (i < n && /\d/.test(f[i])) { cnt = cnt*10 + Number(f[i]); i++; }
            if (cnt === 0) cnt = 1;
            if (!seen.has(atom)) { seen.add(atom); order.push(atom); }
            st.push([atom, cnt]);
        } else i++;
    }
    const total = new Map<string, number>();
    for (const [a, c] of st) total.set(a, (total.get(a) || 0) + c);
    return order.map(a => `${a}:${total.get(a)}`).join(' ');
}
console.log(formulaParsing("(HO)2"));
console.log(formulaParsing("H(N(KO)2)3"));
console.log(formulaParsing("KH"));
```

```go,editable
package main
import (
    "fmt"
    "strconv"
    "unicode"
    "strings"
)
type entry struct { name byte; count int }
func formulaParsing(f string) string {
    st := []entry{}
    order := []byte{}; seen := make(map[byte]bool)
    n := len(f); i := 0
    for i < n {
        ch := f[i]
        if ch == '(' { st = append(st, entry{'(', -1}); i++
        } else if ch == ')' {
            i++; mult := 0
            for i < n && unicode.IsDigit(rune(f[i])) { mult = mult*10 + int(f[i] - '0'); i++ }
            if mult == 0 { mult = 1 }
            grp := []entry{}
            for len(st) > 0 && st[len(st)-1].name != '(' { grp = append(grp, st[len(st)-1]); st = st[:len(st)-1] }
            if len(st) > 0 { st = st[:len(st)-1] }
            for j := len(grp) - 1; j >= 0; j-- { st = append(st, entry{grp[j].name, grp[j].count * mult}) }
        } else if ch >= 'A' && ch <= 'Z' {
            atom := ch; i++; cnt := 0
            for i < n && unicode.IsDigit(rune(f[i])) { cnt = cnt*10 + int(f[i] - '0'); i++ }
            if cnt == 0 { cnt = 1 }
            if !seen[atom] { seen[atom] = true; order = append(order, atom) }
            st = append(st, entry{atom, cnt})
        } else { i++ }
    }
    total := make(map[byte]int)
    for _, e := range st { total[e.name] += e.count }
    parts := []string{}
    for _, a := range order { parts = append(parts, fmt.Sprintf("%c:%d", a, total[a])) }
    return strings.Join(parts, " ")
    _ = strconv.Atoi
}
func main() {
    fmt.Println(formulaParsing("(HO)2"))
    fmt.Println(formulaParsing("H(N(KO)2)3"))
    fmt.Println(formulaParsing("KH"))
}
```

```rust,editable
use std::collections::HashMap;
fn formula_parsing(f: &str) -> String {
    let bytes = f.as_bytes();
    let mut st: Vec<(char, i32)> = Vec::new();
    let mut order: Vec<char> = Vec::new();
    let mut seen: std::collections::HashSet<char> = std::collections::HashSet::new();
    let n = bytes.len(); let mut i = 0;
    while i < n {
        let ch = bytes[i] as char;
        if ch == '(' { st.push(('(', -1)); i += 1; }
        else if ch == ')' {
            i += 1; let mut mult = 0;
            while i < n && (bytes[i] as char).is_ascii_digit() { mult = mult*10 + (bytes[i] - b'0') as i32; i += 1; }
            if mult == 0 { mult = 1; }
            let mut grp: Vec<(char, i32)> = Vec::new();
            while let Some(&(a, c)) = st.last() {
                if a == '(' { break; }
                grp.push((a, c)); st.pop();
            }
            if st.last().map(|x| x.0) == Some('(') { st.pop(); }
            for j in (0..grp.len()).rev() { st.push((grp[j].0, grp[j].1 * mult)); }
        } else if ch.is_ascii_uppercase() {
            let atom = ch; i += 1; let mut cnt = 0;
            while i < n && (bytes[i] as char).is_ascii_digit() { cnt = cnt*10 + (bytes[i] - b'0') as i32; i += 1; }
            if cnt == 0 { cnt = 1; }
            if !seen.contains(&atom) { seen.insert(atom); order.push(atom); }
            st.push((atom, cnt));
        } else { i += 1; }
    }
    let mut total: HashMap<char, i32> = HashMap::new();
    for (a, c) in st { *total.entry(a).or_insert(0) += c; }
    order.iter().map(|a| format!("{}:{}", a, total[a])).collect::<Vec<_>>().join(" ")
}
fn main() {
    println!("{}", formula_parsing("(HO)2"));
    println!("{}", formula_parsing("H(N(KO)2)3"));
    println!("{}", formula_parsing("KH"));
}
```

</div>

***

## Final Takeaway

Three lessons:

1. **The stack holds partial answers in progress.** Whenever a closer event fires, you collapse a chunk of the stack into a single combined value and push that back. The result keeps growing until the next closer or end of input.
2. **Indices, characters, strings, or records — push whatever the problem needs.** Path tokens for path simplification; characters for bracket reversal; (atom, count) records for chemical formulas. The container shape adapts; the stack discipline doesn't.
3. **Multi-digit numbers and multi-character tokens need a sub-loop.** Inside the main scan, slurp consecutive digits or letters before pushing — otherwise `12[a]` will push `1`, `2`, `[`, `a`, `]` and you'll lose the multiplier.

> *Coming up — the **design** lesson. We've built five problem patterns; the final lesson takes the stack interface and asks: <em>what would it take to extend it with one extra O(1) operation, like <code>min()</code>?</em> Two classic interview questions — Min Stack (push, pop, top, min — all O(1)) and Stack Using Queues — close out the section by demonstrating how to <em>compose stacks with auxiliary structures</em> to add new functionality without losing the original O(1) guarantees.*
