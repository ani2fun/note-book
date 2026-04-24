# 6. Pattern: Counting

## Table of contents

1. [Understanding the counting pattern](#understanding-the-counting-pattern)
2. [Identifying the counting pattern](#identifying-the-counting-pattern)
3. [First non repeating character](#first-non-repeating-character)
4. [Constructibility check](#constructibility-check)
5. [Anagram checker](#anagram-checker)
6. [Build palindrome](#build-palindrome)
7. [Cluster anagrams](#cluster-anagrams)

***

# Understanding the counting pattern

Some problems require us to remember some or all occurrences of data items in a sequence of items, which can be any linear data structure like an array, string, or linked list. While there are many ways to solve such problems, a hash table that maps each data item to its count (frequency) can solve such problems efficiently. The counting technique iterates through the sequence while maintaining the count (frequency) of data items seen so far in a hash table.

The counting pattern is a classification of problems that can be solved using the counting technique.

// Diagram: The counting technique counts the frequency of all items in an array using a hash map.

## Counting technique

The counting technique is quite simple and easy to understand. Consider we are given a string `s` and we need to count the frequency of all characters. We initialize a hash map `frequency` to map a character to its frequency and iterate the array from start to end. In each iteration, we check if the current character exists in the frequency map and increment its count by one. At the end of all iterations, the frequency map will have the count of all characters in `s`.

// Diagram: Counting technique using a hash map

It is important to note that the counting technique does not solve the problem directly. Once we compute the frequency of all items in a sequence, the next step is to use this frequency map as input to solve the problem.

## Algorithm

The algorithm given below outlines the technique to compute the frequency of data items in a sequence.

> **Algorithm**
>
> -   **Step 1:** Initialize a map \`frequency\` to map characters to an integer
> -   **Step 2:** Iterate in the string or array, and for each item, do the following:
>     -   **Step 2.1:** If the item exists in \`frequency\` map increment its count by one otherwise, set it to one

## Implementation

Given below is the generic code implementation to calculate the frequency of characters in an array of characters using a hash map.  

C++

```cpp

// Diagram: unorderedmap<char, int> countFrequency(string s) {

    // Initialize a hash map to map a character to its frequency
    unordered_map<char, int> frequency;

    // Traverse the string and store the frequency of each character
    // in a hash map
    for (char ch : s) {
        frequency[ch]++;
    }

    return frequency;
}
```

Java

```java

class Solution {
    public Map<Character, Integer> countFrequency(String s) {
        // Initialize a hash map to map a character to its frequency
        Map<Character, Integer> frequency = new HashMap<>();

        // Traverse the string and store the frequency of each character in a hash map
        for (char ch : s.toCharArray()) {
            frequency.put(ch, frequency.getOrDefault(ch, 0) + 1);
        }

        return frequency;
    }
```

Typescript

```typescript

countFrequency(s: string): Map<string, number> {
    // Initialize a hash map to map a character to its frequency
    const frequency = new Map<string, number>();

    // Traverse the string and store the frequency of each character in a hash map
    for (const ch of s) {
        frequency.set(ch, (frequency.get(ch) || 0) + 1);
    }

    return frequency;
}
```

Javascript

```javascript

function countFrequency(s) {
    // Initialize a hash map to map a character to its frequency
    const frequency = new Map();

    // Traverse the string and store the frequency of each character in a hash map
    for (const ch of s) {
        frequency.set(ch, (frequency.get(ch) || 0) + 1);
    }

    return frequency;
}
```

Python

```python
def count_frequency(self, s: str) -> Dict[str, int]:
    # Initialize a hash map to map a character to its frequency
    frequency = defaultdict(int)

    # Traverse the string and store the frequency of each character in a hash map
    for ch in s:
        frequency[ch] = frequency.get(ch, 0) + 1

    return frequency
```

## Complexity Analysis

The algorithm's time and space complexity is easy to understand. We traverse the array from start to end, in any case and since adding a new mapping to a hash map and updating the mapped value have a constant **O(1)** amortized time complexity, the runtime complexity for the algorithm linear **O(N)**.

We create a hash map to count the frequency of characters where the number of items in the hash table equals the number of unique characters in an array. In the worst case, all characters in the array `arr` may be unique, leading to a linear **O(N)** space complexity. In the best case, only a single character may be repeated in `arr`, leading to a constant **O(1)** space complexity.

> **Best Case -** Only one unique character
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**
>
> **Worst Case -** All unique characters
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

Later in the course, we will examine techniques for identifying problems that can be solved using the counting technique and walk through an example to better understand it.

***

# Identifying the counting pattern

The counting technique can only be used to solve some specific problems. These are generally **easy** or **medium** problems involving arrays or strings where we must remember some or all the occurrences of a data item to use it later. In most cases, applying the counting technique does not solve the problem; it only computes the frequency map. The frequency map is then used as an input along with other problem contexts to partially or completely solve the problem.

If the problem statement or its solution follows the generic template below, it can be solved by applying the counting technique.

**Template:**

Given an iterable sequence of data, compute the frequency map of its items and use it to solve the problem.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the counting technique.

> **Problem statement:** Given a string \`s\`, write a function to return the index of the first non-repeating character. Return -1 if no such character is found.

// Diagram: Find the first non-repeating character in a string.

### Brute force solution

The simplest brute-force solution to this problem is to traverse the string from start to end and, in each iteration, pick the current character and search for it in the entire string using another loop. At any point, if we find a character that we cannot find anywhere else in the string using the inner loop, we return its index as the solution. If no such character is found, we return -1.

// Diagram: Brute force solution to find the first non-repeating character

The implementation of the brute force solution is given as follows.

C++

```cpp
#include <unordered_map>

// Diagram: using namespace std;

class Solution {
public:
    unordered_map<char, int> countFrequency(string s) {
        unordered_map<char, int> frequency;

        // Traverse the string and store the frequency of each character
        // in a hash map
        for (char ch : s) {
            frequency[ch]++;
        }

        return frequency;
    }

// Diagram: int firstNonRepeatingCharacter(string s) {

        // Create a map to store the frequency of each character in the
        // string
        unordered_map<char, int> frequency = countFrequency(s);

        // Traverse the string again and return the index of the first
        // non-repeating character
        for (int i = 0; i < s.length(); i++) {
            if (frequency[s[i]] == 1) {
                return i;
            }

        return -1;
    }
};
```

Java

```java

// Diagram: class FirstNonRepeatingCharacter {

// Diagram: public int firstNonRepeatingCharacter(String s) {

        // Traverse the string from start to end
        for (int i = 0; i < s.length(); i++) {
            // Initialize a flag variable to identify
            // the first non-repeating character
            boolean repeated = false;

            // Use an inner loop to search for s.charAt(i)
            for (int j = 0; j < s.length(); j++) {
                // Ignore match with itself
                if (i == j) {
                    continue;
                }
                // Set flag variable to true if repetition found
                else if (s.charAt(i) == s.charAt(j)) {
                    repeated = true;
                    break;
                }

            // Check if s.charAt(i) was repeated in the string
            if (!repeated) {
                return i;
            }

        return -1;
    }
```

Typescript

```typescript

// Diagram: function firstNonRepeatingCharacter(s: string): number {

  // Traverse the string from start to end
  for (let i = 0; i < s.length; i++) {
    // Initialize a flag variable to identify
    // the first non-repeating character
    let repeated = false;

    // Use an inner loop to search for s[i]
    for (let j = 0; j < s.length; j++) {
      // Ignore match with itself
      if (i === j) {
        continue;
      }
      // Set flag variable to true if repetition found
      else if (s[i] === s[j]) {
        repeated = true;
        break;
      }

    // Check if s[i] was repeated in the string
    if (!repeated) {
      return i;
    }

  return -1;
}
```

Javascript

```javascript

// Diagram: function firstNonRepeatingCharacter(s) {

  // Traverse the string from start to end
  for (let i = 0; i < s.length; i++) {
    // Initialize a flag variable to identify
    // the first non-repeating character
    let repeated = false;

    // Use an inner loop to search for s[i]
    for (let j = 0; j < s.length; j++) {
      // Ignore match with itself
      if (i === j) {
        continue;
      }
      // Set flag variable to true if repetition found
      else if (s[i] === s[j]) {
        repeated = true;
        break;
      }

    // Check if s[i] was repeated in the string
    if (!repeated) {
      return i;
    }

  return -1;
}
```

Python

```python

def first_non_repeating_character(s: str) -> int:
    # Traverse the string from start to end
    for i in range(len(s)):
        # Initialize a flag variable to identify
        # the first non-repeating character
        repeated = False

        # Use an inner loop to search for s[i]
        for j in range(len(s)):
            # Ignore match with itself
            if i == j:
            # Set flag variable to True if repetition is found
            elif s[i] == s[j]:
                repeated = True
                break

        # Check if s[i] was repeated in the string
        if not repeated:
            return i

    return -1
```

The brute force implementation uses nested loops to search for each character in the array, which is not efficient and has **O(N^2)** time complexity in the worst case.

### Counting technique solution

We can solve the problem using the counting technique to compute the frequency map of all characters in the string. We can then traverse the string and use the frequency map to get the first character with frequency 1.

The solution to the problem follows the template for the counting pattern we learned earlier.

**Template:**

Given a string `s` (sequence of data), compute the frequency map of its items and use it to solve the problem.

We initialize a character to integer map `frequency` and traverse the string from start to end. In each iteration, we increment the count of the current character by one if it is already present in the map; otherwise, we set it to 1. At the end of all iterations, we get the frequency of all characters in the `frequency` map.

// Diagram: Create frequency map using counting technique

We then traverse the string again from start to end and return the index of the first character that has frequency 1 in the `frequency` map. If no such character is present, we return -1.

// Diagram: Use the frequency map to find the first non-repeating character

The implementation of the counting technique solution is given as follows.

C++

```cpp
#include <unordered_map>

// Diagram: using namespace std;

class Solution {
public:
    unordered_map<char, int> countFrequency(string s) {
        unordered_map<char, int> frequency;

        // Traverse the string and store the frequency of each character
        // in a hash map
        for (char ch : s) {
            frequency[ch]++;
        }

        return frequency;
    }

// Diagram: int firstNonRepeatingCharacter(string s) {

        // Create a map to store the frequency of each character in the
        // string
        unordered_map<char, int> frequency = countFrequency(s);

        // Traverse the string again and return the index of the first
        // non-repeating character
        for (int i = 0; i < s.length(); i++) {
            if (frequency[s[i]] == 1) {
                return i;
            }

        return -1;
    }
};
```

Java

```java

// Diagram: class FirstNonRepeatingCharacter {

// Diagram: public int firstNonRepeatingCharacter(String s) {

        // Traverse the string from start to end
        for (int i = 0; i < s.length(); i++) {
            // Initialize a flag variable to identify
            // the first non-repeating character
            boolean repeated = false;

            // Use an inner loop to search for s.charAt(i)
            for (int j = 0; j < s.length(); j++) {
                // Ignore match with itself
                if (i == j) {
                    continue;
                }
                // Set flag variable to true if repetition found
                else if (s.charAt(i) == s.charAt(j)) {
                    repeated = true;
                    break;
                }

            // Check if s.charAt(i) was repeated in the string
            if (!repeated) {
                return i;
            }

        return -1;
    }
```

Typescript

```typescript
export class Solution {
    countFrequency(s: string): Map<string, number> {
        const frequency = new Map<string, number>();

        // Traverse the string and store the frequency of each character
        // in a hash map
        for (const ch of s) {
            frequency.set(ch, (frequency.get(ch) || 0) + 1);
        }

        return frequency;
    }

// Diagram: firstNonRepeatingCharacter(s: string): number {

        // Create a map to store the frequency of each character in the
        // string
        const frequency = this.countFrequency(s);

        // Traverse the string again and return the index of the first
        // non-repeating character
        for (let i = 0; i < s.length; i++) {
            if (frequency.get(s[i]) === 1) {
                return i;
            }

        return -1;
    }
```

Javascript

```javascript
export class Solution {
    countFrequency(s) {
        const frequency = new Map();

        // Traverse the string and store the frequency of each character
        // in a hash map
        for (const ch of s) {
            frequency.set(ch, (frequency.get(ch) || 0) + 1);
        }

        return frequency;
    }

// Diagram: firstNonRepeatingCharacter(s) {

        // Create a map to store the frequency of each character in the
        // string
        const frequency = this.countFrequency(s);

        // Traverse the string again and return the index of the first
        // non-repeating character
        for (let i = 0; i < s.length; i++) {
            if (frequency.get(s[i]) === 1) {
                return i;
            }

        return -1;
    }
```

Python

```python
from collections import defaultdict
from typing import Dict

class Solution:
    def count_frequency(self, s: str) -> Dict[str, int]:
        frequency = defaultdict(int)

        # Traverse the string and store the frequency of each character
        # in a hash map
        for ch in s:
            frequency[ch] = frequency.get(ch, 0) + 1

// Diagram: return frequency

    def first_non_repeating_character(self, s: str) -> int:

        # Create a map to store the frequency of each character in the
        # string
        frequency = self.count_frequency(s)

        # Traverse the string again and return the index of the first
        # non-repeating character
        for i, ch in enumerate(s):
            if frequency[ch] == 1:
                return i

        return -1
```

The counting technique only traverses the array twice in any case, and so has a linear **O(N)** time complexity, which is much better than the brute force solution. However, creating the frequency map uses extra **O(N)** space in the worst case.

## Example problems

Most problems that fall under this category are **easy** or **medium** problems; a list of a few is given below.

> -   **[First non repeating character](https://www.codeintuition.io/courses/hash-table/iwmK83E8AwdS-EyCuKUiB)**
> -   **[Constructibility check](https://www.codeintuition.io/courses/hash-table/ke_QCnH8ROqa-z6J5SsHP)**
> -   **[Anagram checker](https://www.codeintuition.io/courses/hash-table/oaRvugNe9Rd0YTdOm1nvu)**
> -   **[Build palindrome](https://www.codeintuition.io/courses/hash-table/fhWiyXqgrPGomWC42GbRi)**
> -   **[Cluster anagrams](https://www.codeintuition.io/courses/hash-table/nROY2-5uP3Ij5a0GOfqUD)**

We will now solve these problems to understand the counting technique better.

***

# First non repeating character

## Problem Statement

Given a string **s**, write a function to find and return the index of the first non-repeating character in it. If it does not exist, return `-1`.

### Example 1

> -   **Input:** s = codeintuition
> -   **Output:** 0
> -   **Explanation:** 'c' is the first non-repeating character in the string "codeintuition".

### Example 2

> -   **Input:** s = aaabcd
> -   **Output:** 3
> -   **Explanation:** 'b' is the first non-repeating character in the string "aaabcd".

### Example 3

> -   **Input:** s = aaabbccdd
> -   **Output:** -1
> -   **Explanation:** string "aaabbccdd" has no non-repeating character.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    unordered_map<char, int> countFrequency(string s) {
        unordered_map<char, int> frequency;

        // Traverse the string and store the frequency of each character
        // in a hash map
        for (char ch : s) {
            frequency[ch]++;
        }

        return frequency;
    }

    int firstNonRepeatingCharacter(string s) {

        // Create a map to store the frequency of each character in the
        // string
        unordered_map<char, int> frequency = countFrequency(s);

        // Traverse the string again and return the index of the first
        // non-repeating character
        for (int i = 0; i < s.length(); i++) {
            if (frequency[s[i]] == 1) {
                return i;
            }
        }

        return -1;
    }
};
```

***

# Constructibility check

## Problem Statement

Given two strings, **s1** and **s2**, write a function that returns `true` if s1 can be constructed by using the letters from the s2 and `false` otherwise. Each letter in the s2 can only be used once in the s1.

### Example 1

> -   **Input:** s1 = somenote, s2 = enetomoselse
> -   **Output:** true
> -   **Explanation:** s1 can be constructed using the letters from s2.

### Example 2

> -   **Input:** s1 = thief, s2 = hifacqet
> -   **Output:** true
> -   **Explanation:** s1 can be constructed using the letters from s2.

### Example 3

> -   **Input:** s1 = alpha, s2 = beta
> -   **Output:** false
> -   **Explanation:** s1 cannot be constructed using the letters from s2.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    unordered_map<char, int> countFrequency(string s) {
        unordered_map<char, int> frequency;
        for (char ch : s) {
            frequency[ch]++;
        }

        return frequency;
    }

    bool constructibilityCheck(string s1, string s2) {

        // Create a map to store the frequency of each character in s2
        unordered_map<char, int> s2Frequency = countFrequency(s2);

        // Iterate over the characters in s1
        for (char ch : s1) {

            // If the frequency of the character is zero, return false
            if (s2Frequency[ch] == 0) {
                return false;
            }

            // Decrement the frequency of the character in the map
            s2Frequency[ch]--;
        }

        // If all characters in s1 can be constructed from s2, return
        // true
        return true;
    }
};
```

***

# Anagram checker

## Problem Statement

Given two strings, **s**, and **p**, write a function that returns `true` if p is an anagram of s, otherwise return `false`.

An anagram is a word or phrase formed by rearranging the letters of another word or phrase.

### Example 1

> -   **Input:** s = codeintuition, p = cdoenoitiutni
> -   **Output:** true
> -   **Explanation:** p is an anagram of s.

### Example 2

> -   **Input:** s = abc, p = ade
> -   **Output:** false
> -   **Explanation:** p is not an anagram of s.

### Example 3

> -   **Input:** s = abcdef, p = dfecba
> -   **Output:** true
> -   **Explanation:** p is an anagram of s.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    unordered_map<char, int> countFrequency(string s) {
        unordered_map<char, int> frequency;
        for (char ch : s) {
            frequency[ch]++;
        }

        return frequency;
    }

    bool anagramChecker(string s, string t) {
        if (s.length() != t.length()) {
            return false;
        }

        // Create a map to store the frequency of each character in the
        // first string
        unordered_map<char, int> sFrequency = countFrequency(s);

        // Traverse the second string and decrement the frequency of each
        // character in the hash map
        for (char ch : t) {
            if (sFrequency.find(ch) == sFrequency.end()) {
                return false;
            }

            sFrequency[ch]--;
            if (sFrequency[ch] == 0) {
                sFrequency.erase(ch);
            }
        }

        return sFrequency.empty();
    }
};
```

***

# Build palindrome

## Problem Statement

Given a string **s** that consists of lowercase or uppercase letters, write a function that finds and returns the length of the longest palindrome, which can be built using all or some of those letters.

Letters are case sensitive, for example, "Cc" is not considered a palindrome here.

### Example 1

> -   **Input:** s = AaAaBbBbc
> -   **Output:** 9
> -   **Explanation:** There are multiple palindromic strings that can be formed using all the characters. One such string is "BAabcbaAB".

### Example 2

> -   **Input:** s = abbd
> -   **Output:** 3
> -   **Explanation:** Palindromes that can be formed are "bab" or "bdb".

### Example 3

> -   **Input:** s = abc
> -   **Output:** 1
> -   **Explanation:** Palindromes that can be formed are "a", "b" or "c".

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    unordered_map<char, int> countFrequency(string s) {
        unordered_map<char, int> frequency;
        for (char ch : s) {
            frequency[ch]++;
        }

        return frequency;
    }

    int buildPalindrome(string s) {

        // Create a map to store the frequency of each character in the
        // string
        unordered_map<char, int> frequency = countFrequency(s);

        // Initialize the length of the longest palindrome
        int length = 0;

        // Initialize a boolean flag to check if there are odd counts of
        // characters
        bool odd = false;

        // Iterate over the map to calculate the length of the longest
        // palindrome
        for (auto entry : frequency) {

            // If the count of the character is even, add it to the
            // length
            if (entry.second % 2 == 0) {
                length += entry.second;
            }

            // If the count of the character is odd, add the count minus
            // one to the length and set the odd flag to true
            else {
                length += entry.second - 1;
                odd = true;
            }
        }

        // If there are odd counts of characters, add one to the length
        return odd ? length + 1 : length;
    }
};
```

***

# Cluster anagrams

## Problem Statement

Given an array of strings **strs**, write a function that returns a list of lists where all the anagrams are grouped together. You can return the answer in **any order**.

An anagram is a word or phrase formed by rearranging the letters of another word or phrase.

### Example 1

> -   **Input:** strs = \[abc, cab, def, dfe, hij\]
> -   **Output:** \[\[abc, cab\], \[def, dfe\], \[hij\]\]
> -   **Explanation:** All the anagrams are grouped together.

### Example 2

> -   **Input:** strs = \[a, b, c, d, e\]
> -   **Output:** \[\[a\], \[b\], \[c\], \[d\], \[e\]\]
> -   **Explanation:** All the anagrams are grouped together.

### Example 3

> -   **Input:** strs = \[\]
> -   **Output:** \[\]
> -   **Explanation:** All the anagrams are grouped together.

## Solution

```cpp
#include <map>
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<int> countFrequency(string str) {

        // Initialize frequency vector for 26 letters
        vector<int> frequency(26, 0);
        for (char c : str) {

            // Increment the count for each character
            frequency[c - 'a']++;
        }
        return frequency;
    }

    vector<vector<string>> clusterAnagrams(vector<string> &strs) {

        // Map to store character frequency vectors as keys and lists of
        // indices as values
        map<vector<int>, vector<int>> frequencyGroups;

        // Populate the frequencyGroups with indices of strings grouped
        // by character frequencies
        for (int i = 0; i < strs.size(); i++) {

            // Count the frequency of each character in the string
            vector<int> frequency = countFrequency(strs[i]);

            // Group strings with the same frequency vector by storing
            // their indices
            frequencyGroups[frequency].push_back(i);
        }

        // Collect grouped anagrams into the result array
        vector<vector<string>> result;

        // Iterate over each group of indices in frequencyGroups
        for (auto &entry : frequencyGroups) {
            vector<string> anagramGroup;
            for (int index : entry.second) {

                // Use the index to get the original string and add it to
                // the anagram group
                anagramGroup.push_back(strs[index]);
            }

            // Add the anagram group to the result
            result.push_back(anagramGroup);
        }
        return result;
    }
};
```
