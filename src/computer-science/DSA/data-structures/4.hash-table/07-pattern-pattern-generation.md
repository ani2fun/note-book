# 7. Pattern: Pattern generation

## Table of contents

1. [Understanding the pattern generation pattern](#understanding-the-pattern-generation-pattern)
2. [Identifying the pattern generation pattern](#identifying-the-pattern-generation-pattern)
3. [Row specific words](#row-specific-words)
4. [Homomorphic strings](#homomorphic-strings)
5. [Pattern matching](#pattern-matching)
6. [Cluster displaced strings](#cluster-displaced-strings)

***

# Understanding the pattern generation pattern

***

# Identifying the pattern generation pattern

The pattern generation technique can only be used to solve some specific problems. These are generally **easy** or **medium** problems involving arrays or strings, where we must assign a unique pattern value to the input sequence. In most cases, applying the pattern generation technique does not solve the problem; it only generates a pattern string. This pattern string is then used along with other problem contexts to partially or completely solve the problem.

If the problem statement or its solution follows the generic template below, it can be solved by applying the counting technique.

**Template:**

Given an iterable sequence, generate a string representing the pattern followed in the sequence.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the hash assignment technique.

> **Problem statement:** Given two strings \`s\` and \`t\`, find if they are homomorphic. Two strings are homomorphic if replacing each unique character in one string with some other character produces the second string. All occurrences of the characters must be replaced while preserving the original order.

// Diagram: Find if two strings are homomorphic

### Pattern generation technique

Observing the problem more closely, we can see that two strings can only be holomorphic if they follow the same pattern. If two strings don;t follow the same pattern, it is impossible to replace characters in one string to get the other. This means that if the pattern strings for both the input strings are equal, the two strings are holomorphic. The solution to the problem follows the template for the pattern generation pattern we learned earlier.

**Template:**

Given two iterable sequences `s` and `t`, generate strings representing the pattern followed in these strings.

We initialize an empty string `pattern`, a `seed` variable with 0 and a hash map `map`. We then traverse the string, and for each character, check if it is already mapped to some character in `map`. If not, we map it to the current value of `seed` in `map` and increment `seed`; otherwise, we use the mapped value in `map`.  We then append this value at the end of the `pattern` string along with a `,` as a delimiter value.

At the end of all iterations, we get the pattern string in `pattern`.

// Diagram: Generate a pattern for string s

We then repeat the process for the other string `t`. Since both the strings follow the same pattern, we can conclude that they are homomorphic.

// Diagram: Generate a pattern for string t

The implementation of the pattern generation solution is given as follows.

C++

```cpp
#include <unordered_map>

// Diagram: using namespace std;

class Solution {
public:
    string generatePattern(const string &str) {
        unordered_map<char, int> charToIndex;
        string pattern = "";
        int index = 0;

        // Create a mapped value based on the first occurrence of each
        // character
        for (char ch : str) {
            if (charToIndex.find(ch) == charToIndex.end()) {
                charToIndex[ch] = index++;
            }
            pattern += to_string(charToIndex[ch]) + ",";
        }

        return pattern;
    }

// Diagram: bool homomorphicStrings(string s, string t) {

        // Strings of different lengths can't be homomorphic
        if (s.length() != t.length()) {
            return false;
        }

        // If the generated patterns are same, the string are homomorphic
        return generatePattern(s) == generatePattern(t);
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public String generatePattern(String str) {
        Map<Character, Integer> charToIndex = new HashMap<>();
        StringBuilder pattern = new StringBuilder();
        int index = 0;

        // Create a mapped value based on the first occurrence of each
        // character
        for (char ch : str.toCharArray()) {
            if (!charToIndex.containsKey(ch)) {
                charToIndex.put(ch, index++);
            }
            pattern.append(charToIndex.get(ch)).append(",");
        }

        return pattern.toString();
    }

// Diagram: public boolean homomorphicStrings(String s, String t) {

        // Strings of different lengths can't be homomorphic
        if (s.length() != t.length()) {
            return false;
        }

        // If the generated patterns are the same, the strings are
        // homomorphic
        return generatePattern(s).equals(generatePattern(t));
    }
```

Typescript

```typescript
export class Solution {
    generatePattern(str: string): string {
        const charToIndex: Map<string, number> = new Map();
        let pattern = "";
        let index = 0;

        // Create a mapped value based on the first occurrence of each
        // character
        for (const ch of str) {
            if (!charToIndex.has(ch)) {
                charToIndex.set(ch, index++);
            }
            pattern += charToIndex.get(ch)! + ",";
        }

        return pattern;
    }

// Diagram: homomorphicStrings(s: string, t: string): boolean {

        // Strings of different lengths can't be homomorphic
        if (s.length !== t.length) {
            return false;
        }

        // If the generated patterns are the same, the strings are
        // homomorphic
        return this.generatePattern(s) === this.generatePattern(t);
    }
```

Javascript

```javascript
export class Solution {
    generatePattern(str) {
        const charToIndex = new Map();
        let pattern = "";
        let index = 0;

        // Create a mapped value based on the first occurrence of each
        // character
        for (const ch of str) {
            if (!charToIndex.has(ch)) {
                charToIndex.set(ch, index++);
            }
            pattern += charToIndex.get(ch) + ",";
        }

        return pattern;
    }

// Diagram: homomorphicStrings(s, t) {

        // Strings of different lengths can't be homomorphic
        if (s.length !== t.length) {
            return false;
        }

        // If the generated patterns are the same, the strings are
        // homomorphic
        return this.generatePattern(s) === this.generatePattern(t);
    }
```

Python

```python
from typing import Dict

class Solution:
    def generate_pattern(self, s: str) -> str:
        char_to_index: Dict[str, int] = {}
        pattern = ""
        index = 0

        # Create a mapped value based on the first occurrence of each
        # character
        for ch in s:
            if ch not in char_to_index:
                char_to_index[ch] = index
                index += 1
            pattern += str(char_to_index[ch]) + ","

// Diagram: return pattern

    def homomorphic_strings(self, s: str, t: str) -> bool:

        # Strings of different lengths can't be homomorphic
        if len(s) != len(t):
            return False

        # If the generated patterns are the same, the strings are
        # homomorphic
        return self.generate_pattern(s) == self.generate_pattern(t)
```

The patten generation technique solves the problem in linear **O(N)** time.

## Example problems

Most problems that fall under this category are **easy** or **medium** problems; a list of a few is given below.

> -   **[Row specific words](https://www.codeintuition.io/courses/hash-table/wNvX3lIA9F7n5KYx-D_ok)**
> -   **[Homomorphic strings](https://www.codeintuition.io/courses/hash-table/bgVe45gu8GRuOpMR7oK0o)**
> -   **[Pattern matching](https://www.codeintuition.io/courses/hash-table/CiUczeyG2Y7of_V0aSEmh)**
> -   **[Cluster displaced strings](https://www.codeintuition.io/courses/hash-table/UUDVZtQEiL-MavOCuNyDh)**

We will now solve these problems to understand the pattern generation technique better.

***

# Row specific words

## Problem Statement

Given an array of string words, write a function that returns the words that can be typed using letters of the alphabet on only one row of an American keyboard like the one given below. You can return the answer in **any order**.

> In the American keyboard:
>
> -   the first row consists of the characters **qwertyuiop**,
> -   the second row consists of the characters **asdfghjkl**, and
> -   the third row consists of the characters **zxcvbnm**.

### Example 1

> -   **Input:** words = \[you, were, some\]
> -   **Output:** \[you, were\]
> -   **Explanation:** Both the words "you" and "were" can be formed using the first row. The word "some" needs multiple rows.

### Example 2

> -   **Input:** words = \[sdk, nvm, hut\]
> -   **Output:** \[sdk, nvm\]
> -   **Explanation:** The words "sdk" and "nvm" can be formed using the second and third rows, respectively. The word "hut" needs multiple rows.

### Example 3

> -   **Input:** words = \[him, else, bat\]
> -   **Output:** \[\]
> -   **Explanation:** None of the words can be formed using only a single row of keyboard.

## Solution

```cpp
#include <unordered_set>

using namespace std;

class Solution {
public:
    unordered_set<char> getRow1() {
        return {'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'};
    }

    unordered_set<char> getRow2() {
        return {'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'};
    }

    unordered_set<char> getRow3() {
        return {'z', 'x', 'c', 'v', 'b', 'n', 'm'};
    }

    int getRow(char c) {
        static unordered_set<char> row1 = getRow1();
        static unordered_set<char> row2 = getRow2();
        static unordered_set<char> row3 = getRow3();

        if (row1.count(c)) {
            return 1;
        }

        if (row2.count(c)) {
            return 2;
        }

        if (row3.count(c)) {
            return 3;
        }

        // This case won't occur as all characters are from valid rows
        return 0;
    }

    bool canBeTypedWithOneRow(string &word) {

        // Get the row for the first character
        int row = getRow(tolower(word[0]));

        // Check if all characters belong to the same row
        for (char c : word) {
            if (getRow(tolower(c)) != row) {
                return false;
            }
        }

        return true;
    }

    vector<string> rowSpecificWords(vector<string> &words) {
        vector<string> result;

        // Iterate over each word
        for (string &word : words) {
            if (canBeTypedWithOneRow(word)) {
                result.push_back(word);
            }
        }

        return result;
    }
};
```

***

# Homomorphic strings

## Problem Statement

Given two strings, **s**, and **t**, write a function that returns `true` if they are homomorphic, return `false` otherwise.

Two strings, **s**, and **t,** are homomorphic if the characters in **s** can be replaced to get **t**. All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.

### Example 1

> -   **Input:** s = add, t = qpp
> -   **Output:** true
> -   **Explanation:** By replacing 'a' with 'q' and 'd' with 'p' in string s, we can get string t.

### Example 2

> -   **Input:** s = dad, t = mom
> -   **Output:** true
> -   **Explanation:** By replacing 'd' with 'm' and 'a' with 'o' in string s we can get string t.

### Example 3

> -   **Input:** s = all, t = mom
> -   **Output:** false
> -   **Explanation:** The above strings are not homomorphic.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    string generatePattern(string &str) {
        unordered_map<char, int> charToIndex;
        string pattern = "";
        int index = 0;

        // Create a mapped value based on the first occurrence of each
        // character
        for (char ch : str) {
            if (charToIndex.find(ch) == charToIndex.end()) {
                charToIndex[ch] = index++;
            }
            pattern += to_string(charToIndex[ch]) + ",";
        }

        return pattern;
    }

    bool homomorphicStrings(string s, string t) {

        // Strings of different lengths can't be homomorphic
        if (s.length() != t.length()) {
            return false;
        }

        // If the generated patterns are same, the string are homomorphic
        return generatePattern(s) == generatePattern(t);
    }
};
```

***

# Pattern matching

## Problem Statement

Given a **pattern** and a string **s**, write a function that returns `true` if s follows the same pattern, otherwise return `false`.

**Follow** means a full match, such that there is a bijection between a letter in pattern and a **non-empty** word in s.

### Example 1

> -   **Input:** pattern = mom, s = hello world hello
> -   **Output:** true
> -   **Explanation:** The string s matches the pattern, where "hello" is mapped to 'm' and "world" is mapped to 'o'.

### Example 2

> -   **Input:** pattern = abc, s = hello my name
> -   **Output:** true
> -   **Explanation:** The string s matches the pattern, where "hello" is mapped to 'a', "my" is mapped to 'b' and "name" is mapped to 'c'.

### Example 3

> -   **Input:** pattern = abc, s = hello my my
> -   **Output:** false
> -   **Explanation:** The string s does not match the pattern.

## Solution

```cpp
#include <sstream>
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<string> splitInWords(string s) {
        istringstream ss(s);
        string word;
        vector<string> words;
        while (ss >> word) {
            words.push_back(word);
        }
        return words;
    }

    vector<string> stringToList(string str) {

        // Convert each character to a string and add to vector
        vector<string> result;
        for (char ch : str) {
            result.push_back(string(1, ch));
        }
        return result;
    }

    string generatePattern(vector<string> words) {
        unordered_map<string, int> wordToIndex;
        string pattern = "";
        int index = 0;

        // Create a mapped value based on the first occurrence of each
        // word
        for (string &word : words) {
            if (wordToIndex.find(word) == wordToIndex.end()) {
                wordToIndex[word] = index++;
            }
            pattern += to_string(wordToIndex[word]) + ",";
        }

        return pattern;
    }

    bool patternMatching(string pattern, string s) {

        // Split the string s into an array of words
        vector<string> words = splitInWords(s);

        // If the length of pattern and words are different, return false
        if (pattern.length() != words.size()) {
            return false;
        }

        // If the generated patterns are the same, return true
        return generatePattern(stringToList(pattern)) ==
               generatePattern(words);
    }
};
```

***

# Cluster displaced strings

## Problem Statement

Given an array of strings called **strs** that contains only lowercase alphabets, write a function to group all strings that belong to the same displacing sequence. You can return the answer in **any order**.

The displacing sequence is given below.

abc -> bcd -> ... -> xyz -> yza -> ...

### Example 1

> -   **Input:** strs = \[abc, ghi, xyz, b, c, ab, cd\]
> -   **Output:** \[\[abc, ghi, xyz\], \[b, c\], \[ab, cd\]\]
> -   **Explanation:** The arrays in the above list are all displaced.

### Example 2

> -   **Input:** strs = \[ad, k, cf\]
> -   **Output:** \[\[ad, cf\], \[k\]\]
> -   **Explanation:** The arrays in the above list are all displaced.

### Example 3

> -   **Input:** strs = \[abcd, efg, hi, j\]
> -   **Output:** \[\[abcd\], \[efg\], \[hi\], \[j\]\]
> -   **Explanation:** The arrays in the above list are all displaced.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    string generatePattern(string &s) {
        string pattern = "";

        for (int i = 1; i < s.size(); i++) {

            // Find the difference between consecutive characters
            int difference = s[i] - s[i - 1];
            if (difference < 0) {

                // Handle wrap-around case (e.g., from 'z' to 'a')
                difference += 26;
            }

            // Add the displacement to the pattern
            pattern += to_string(difference) + ",";
        }

        return pattern;
    }

    vector<vector<string>> clusterDisplacedStrings(vector<string> &strs
    ) {
        unordered_map<string, vector<string>> clusters;

        // Process each string and group them by their displacement
        // pattern
        for (string &str : strs) {

            // Generate the pattern for each string
            string pattern = generatePattern(str);

            // Group the strings with the same pattern
            clusters[pattern].push_back(str);
        }

        // Prepare the result with all grouped strings
        vector<vector<string>> result;
        for (auto &entry : clusters) {

            // Add each group to the result
            result.push_back(entry.second);
        }

        return result;
    }
};
```
