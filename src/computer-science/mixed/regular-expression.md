## Regular Expressions (Regex) Tutorial

Regular expressions, or **regex**, are powerful tools for pattern matching in text. They are widely used in programming,
text processing, and data extraction.

---

### 1. **Basics of Regular Expressions**

- A **regular expression** defines a pattern that can be used to match strings in text. It is often used for validation,
  search, and substitution tasks.

- **Code:**

```rust,editable
use regex::Regex;
    
fn main() {
    let re = Regex::new(r"apple").unwrap();
    
    let text = "I like apple pies.";
    
    assert!(re.is_match(text));
    
    println!("Match found for 'apple': {}", re.is_match(text));
}
```

---

### 2. **Literals**

- **Literals** are the simplest form of regex, used to match exact characters.
- **Example**:
    - Regex: `apple`
    - Matches: "apple", "I like apple pies."

- **Code:**

```rust,editable
use regex::Regex;
    
fn main() {
     let re = Regex::new(r"apple").unwrap();
     
     let text = "I like apple pies.";
     
     println!("Match found: {}", re.is_match(text));
}
```

---

### 3. **Character Sets** `[ ]`

**Character sets** are enclosed in square brackets and match any single character within them.

- **Example**:
    - Regex: `gr[aeiou]y`
    - Matches: "gray", "grey"

- **Code:**

```rust,editable
use regex::Regex;
    
fn main() {
     let re = Regex::new(r"gr[aeiou]y").unwrap();
     
     let text = "The sky is gray.";
     
     println!("Match found: {}", re.is_match(text));
} 
```

---

### 4. **Wildcards** `.`

The **wildcard** period (`.`) matches any single character (except a newline).

- **Example**:
    - Regex: `c.t`
    - Matches: "cat", "cot", "cut"

- **Code:**

```rust,editable
use regex::Regex;
    
fn main() {
    let re = Regex::new(r"c.t").unwrap();
    
    let text = "cat, cot, and cut are matched.";
    
    println!("Match found: {}", re.is_match(text));
}
```

---

### 5. **Alternation** `|`

The **pipe** (`|`) allows matching either of two sub-expressions.

- **Example**:
    - Regex: `apple|orange`
    - Matches: "apple", "orange"

- **Code:**

```rust,editable
use regex::Regex;

fn main() {
    let re = Regex::new(r"apple|orange").unwrap();
    
    let text = "I like apple and orange juice.";
    
    println!("Match found: {}", re.is_match(text));
}
```

---

### 6. **Ranges** `[A-Z]`

**Ranges** define a span of characters and can be used inside character sets.

- **Examples**:
    - `[A-Z]`: Any uppercase letter
    - `[0-9]`: Any digit
    - `[a-zA-Z]`: Any letter, upper or lowercase

- **Code:**

```rust
use regex::Regex;
    
fn main() {
    let re = Regex::new(r"[A-Z][0-9]").unwrap();
  
    let text = "A3 is a valid match.";
  
    println!("Match found: {}", re.is_match(text));
}
```

---

### 7. **Shorthand Character Classes**

**Shorthand classes** simplify common patterns:

- `\d`: Matches any digit (equivalent to `[0-9]`)
- `\w`: Matches any word character (equivalent to `[A-Za-z0-9_]`)
- `\s`: Matches any whitespace (spaces, tabs, etc.)

- **Code:**

```rust,editable
use regex::Regex;

fn main() {
    let re = Regex::new(r"\w+@\w+\.\w{2,3}").unwrap();  // Email example
      
    let text = "Send an email to test@example.com.";

    println!("Match found: {}", re.is_match(text));
    } 
```

---

### 8. **Anchors** `^` and `$`

**Anchors** are used to ensure that a match happens at the start (`^`) or the end (`$`) of a string.

- **Example**:
    - Regex: `^hello`
    - Matches: "hello world" but not "world hello"
    - Regex: `world$`
    - Matches: "hello world" but not "world hello"

- **Code:**

```rust
use regex::Regex;
    
fn main() {
    let re = Regex::new(r"^hello").unwrap();  // Start anchor example
    
    let text = "hello world";
    
    println!("Match found: {}", re.is_match(text));
}
```

---

### 9. **Quantifiers**

Quantifiers specify how many times the preceding character or group must appear.

- **Fixed Quantifiers** `{n,m}`: Match between `n` and `m` occurrences.
    - **Example**:
        - Regex: `a{2,4}`
        - Matches: "aa", "aaa", "aaaa"

    - **Code:**
      ```rust,editable
      use regex::Regex;
    
      fn main() {
          let re = Regex::new(r"a{2,4}").unwrap();
          let text = "I like aaa.";
          println!("Match found: {}", re.is_match(text));
      }
      ```

- **Kleene Star** `*`: Match 0 or more occurrences.
    - **Example**:
        - Regex: `ba*`
        - Matches: "b", "ba", "baaaa"
    - **Code:**
      ```rust,editable
       use regex::Regex;

       fn main() {
         let re = Regex::new(r"ba*").unwrap();
         let text = "I saw baaaa!";
         println!("Match found: {}", re.is_match(text));
       }
      ```

- **Kleene Plus** `+`: Match 1 or more occurrences.
    - **Example**:
        - Regex: `ba+`
        - Matches: "ba", "baaaa", but not "b"

    - **Code:**
        ```rust,editable
        use regex::Regex;

        fn main() {
          let re = Regex::new(r"ba+").unwrap();
          let text = "I saw ba!";
          println!("Match found: {}", re.is_match(text));
        }
        ```

- **Optional Quantifier** `?`: Matches 0 or 1 occurrence.
    - **Example**:
        - Regex: `colou?r`
        - Matches: "color", "colour"

    - **Code:**
       ```rust,editable
        use regex::Regex;
    
        fn main() {
          let re = Regex::new(r"colou?r").unwrap();
          let text = "I like both color and colour.";
          println!("Match found: {}", re.is_match(text));
        }
       ```

---

### 10. **Grouping and Capturing** `( )`

**Grouping** with parentheses (`()`) groups parts of the regex together. It's also useful for applying quantifiers to
sub-expressions or capturing matched text.

- **Example**:
    - Regex: `(puppy|kitten)s`
    - Matches: "puppies", "kittens"

- **Code:**

```rust,editable
use regex::Regex;
    
fn main() {
    let re = Regex::new(r"(puppy|kitten)s").unwrap();
    
    let text = "I love kittens and puppies.";
    
    println!("Match found: {}", re.is_match(text));
}    
```

---

### 11. **Escaping Special Characters**

To match characters that have special meanings in regex (such as `.`, `*`, `?`, `+`), use a backslash (`\`) to escape
them.

- **Example**:
    - Regex: `\.`
    - Matches: "."

- **Code:**

```rust,editable
use regex::Regex;    

fn main() {
    let re = Regex::new(r"\.").unwrap();
    let text = "This is a dot.";
    println!("Match found: {}", re.is_match(text));
}
```

---

### 12. **Examples of Common Regex Patterns**

- **Email Validation**:
    - `\w+@\w+\.\w{2,3}`
    - Matches: "user@example.com"
    - **Code:**
      ```rust,editable 
      use regex::Regex;
      fn main() {
        let re = Regex::new(r"\w+@\w+\.\w{2,3}").unwrap();
        let text = "My email is user@example.com.";
        println!("Match found: {}", re.is_match(text));
      }
      ```

- **Phone Number Validation**:
    - `\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}`
    - Matches: "(123) 456-7890", "123-456-7890"
    - **Code:**
      ```rust,editable
        use regex::Regex;
         fn main() {
            let re = Regex::new(r"\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}").unwrap();
            let text = "(123) 456-7890 is a valid phone number.";
            println!("Match found: {}", re.is_match(text));
        }
      ```

- **Date Matching (MM/DD/YYYY)**:
    - `\d{2}/\d{2}/\d{4}`
    - Matches: "12/31/2020"
    - **Code:**
        ```rust,editable
        use regex::Regex;

        fn main() {
            let re = Regex::new(r"\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}").unwrap();
            let text = "(123) 456-7890 is a valid phone number.";
            println!("Match found: {}", re.is_match(text));
        }
        ```

---

### 13. **Practice Challenges**

- **Challenge 1**: Write a regex to match any word that starts with "a" and ends with "t".
    - Solution: `a\w+t`

- **Challenge 2**: Write a regex to match a US-style phone number (with or without parentheses or hyphens).
    - Solution: `\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}`

- **Challenge 3**: Write a regex to match an email address.
    - Solution: `\w+@\w+\.\w+`

- **Code:**

```rust,editable
use regex::Regex;
    
fn main() {
    let re = Regex::new(r"a\w+t").unwrap();
    let text = "The word is ant.";
    println!("Match found: {}", re.is_match(text));
}
```

---

Certainly! Below is the complete document with both explanations and the corresponding Rust code examples for each
section.

---

### 14. **Lookaheads and Lookbehinds (Assertions)**

**Lookaheads** and **lookbehinds** are **zero-width assertions**, meaning they match a pattern but don’t consume any
characters in the string. These assertions allow you to match text based on what comes before or after the main pattern,
without including that text in the match itself.

- **Positive Lookahead** `(?=...)`: Matches a group of characters only if it is followed by another specific pattern.
    - **Example**:
        - Regex: `\d(?= dollars)`
        - Matches: "5 dollars" but will only capture "5"

- **Negative Lookahead** `(?!...)`: Matches a group of characters only if it is **not** followed by another specific
  pattern.
    - **Example**:
        - Regex: `\d(?! dollars)`
        - Matches: "5 pounds" but will not match "5 dollars"

- **Positive Lookbehind** `(?<=...)`: Matches a group of characters only if it is preceded by another specific pattern.
    - **Example**:
        - Regex: `(?<=\$)\d+`
        - Matches: "$500", capturing "500" but not "$"

- **Negative Lookbehind** `(?<!...)`: Matches a group of characters only if it is **not** preceded by another specific
  pattern.
    - **Example**:
        - Regex: `(?<!\$)\d+`
        - Matches: "500" but not "$500"

- **Code:**

Rust's regex crate does not support lookaheads or lookbehinds. Run in your local by adding crate

```toml
[dependencies]
fancy-regex = "0.6.1"
```

Code run disabled:

```
use fancy_regex::Regex;

fn main() {
    // Positive Lookahead
    let re_pos_lookahead = Regex::new(r"\d(?= dollars)").unwrap();
    let text_pos_lookahead = "I have 5 dollars.";
    println!("Positive Lookahead Match: {}", re_pos_lookahead.is_match(text_pos_lookahead).unwrap());

    // Negative Lookahead
    let re_neg_lookahead = Regex::new(r"\d(?! dollars)").unwrap();
    let text_neg_lookahead = "I have 5 pounds.";
    println!("Negative Lookahead Match: {}", re_neg_lookahead.is_match(text_neg_lookahead).unwrap());

    // Positive Lookbehind
    let re_pos_lookbehind = Regex::new(r"(?<=\$)\d+").unwrap();
    let text_pos_lookbehind = "The cost is $500.";
    println!("Positive Lookbehind Match: {}", re_pos_lookbehind.is_match(text_pos_lookbehind).unwrap());

    // Negative Lookbehind
    let re_neg_lookbehind = Regex::new(r"(?<!\$)\d+").unwrap();
    let text_neg_lookbehind = "The number is 500.";
    println!("Negative Lookbehind Match: {}", re_neg_lookbehind.is_match(text_neg_lookbehind).unwrap());
}
```

---

### 15. **Non-Capturing Groups `(?:...)`**

While regular parentheses `()` capture the matched group for further processing, **non-capturing groups** allow grouping
without capturing the match.

- **Example**:
    - Regex: `(?:apple|orange)s`
    - Matches: "apples", "oranges" but won’t capture the match for later use.

- **Code:**

```rust,editable
use regex::Regex;

fn main() {
    let re = Regex::new(r"(?:apple|orange)s").unwrap();
    let text = "I bought apples and oranges.";
    println!("Match found: {}", re.is_match(text));
}
```

---

### 16. **Greedy vs Lazy Matching**

**Quantifiers** like `*`, `+`, and `{}` are **greedy** by default, meaning they match as much text as possible. By
adding a `?`, you can make them **lazy**, meaning they match as little text as possible.

- **Greedy Quantifier**: `.*`
    - Matches as much text as possible.
    - Example: `"a <tag> this is text </tag>"` will match the entire string.

- **Lazy Quantifier**: `.*?`
    - Matches as little text as possible.
    - Example: `"a <tag> this is text </tag>"` will match only "<tag>"

- **Code:**

```rust,editable
use regex::Regex;

fn main() {
    // Greedy Match
    let re_greedy = Regex::new(r"<.*>").unwrap();
    let text_greedy = "a <tag> this is text </tag>";
    println!("Greedy match: {}", re_greedy.is_match(text_greedy));

    // Lazy Match
    let re_lazy = Regex::new(r"<.*?>").unwrap();
    let text_lazy = "a <tag> this is text </tag>";
    println!("Lazy match: {}", re_lazy.is_match(text_lazy));
}
```

---

### 17. **Unicode and Special Characters**

**Unicode** characters or **special symbols** (like accented letters) can be tricky in regex. You can use Unicode escape
sequences to match these characters.

- **Example**: `\u00E9` matches "é"
- Regex engines that support Unicode can also have specific flags (like `/u` in JavaScript) to handle these cases.

- **Code:**

```rust,editable
use regex::Regex;

fn main() {
    let re = Regex::new(r"\u00E9").unwrap();
    let text = "Café";
    println!("Unicode match found: {}", re.is_match(text));
}
```

---

### 18. **Case Insensitivity and Multiline Flags**

Regex engines typically support **flags** that modify how a regex behaves:

- **Case Insensitivity**: Add a flag like `i` (depends on the language).
    - Regex: `/abc/i` will match "abc", "ABC", "aBc", etc.

- **Multiline Matching**: `^` and `$` normally match the start and end of a string, respectively. The **multiline flag
  ** (`m`) makes them match the start and end of each line within a string.
    - Example: `^hello` matches "hello" at the beginning of each line in multiline text.

- **Code:**

```rust,editable
use regex::Regex;

fn main() {
    // Case Insensitive Match
    let re_case_insensitive = Regex::new(r"(?i)abc").unwrap();
    let text_case = "ABC";
    println!("Case Insensitive Match: {}", re_case_insensitive.is_match(text_case));

    // Multiline Match
    let re_multiline = Regex::new(r"(?m)^hello").unwrap();
    let text_multiline = "hello\nworld\nhello again";
    println!("Multiline Match: {}", re_multiline.is_match(text_multiline));
}
```

---

### 19. **Performance Considerations**

When working with large texts or complex patterns, performance can become an issue:

- **Avoid Backtracking**: Using patterns that create unnecessary backtracking can slow down matching. For example, avoid
  nested quantifiers like `.*+`.
- **Atomic Grouping**: Some regex engines support atomic grouping `(?>...)`, which prevents backtracking in specific
  sections of the regex, making it more efficient.

- **Code:**

```rust
use regex::Regex;

fn main() {
    // A more simplified regex without atomic grouping
    let re_no_backtrack = Regex::new(r"\d+[a-zA-Z]+").unwrap();
    let text = "123abc";
    println!("Match found: {}", re_no_backtrack.is_match(text));
}

```

---

### 20. **Regex Testing Tools**

To fully master regular expressions, it’s helpful to practice in **regex testing environments**. Many websites, such as
**regex101.com** or **regexr.com**, allow you to input a regex pattern and see how it matches test strings in real-time.

- **Code:**

This point is about using online tools, so there is no direct Rust code for this. You can test the patterns provided
above on tools like:

- [regex101.com](https://regex101.com)
- [regexr.com](https://regexr.com)

---