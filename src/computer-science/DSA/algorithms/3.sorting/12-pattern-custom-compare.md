# Understanding custom comparators in sorting

Sorting is the process of arranging elements in a collection according to a specific order, such as ascending or descending. For primitive data types like integers, floating-point numbers, or characters, most programming languages provide built-in comparison using relational operators like `` `<` `` and `` `>` `` to establish the greater and smaller relationships.

However, real-world problems often involve sorting more complex data structures such as arrays, lists, maps, or instances of user-defined classes. In such cases, there is no inherent or default way to compare two elements. To sort these non-primitive data types, we need to define explicit rules that determine how one element should be ordered relative to another. This is often done using a custom **comparator**.

A custom comparator defines how two items are compared during the sorting process and allows us to control the ordering logic beyond the default behaviour.

// Diagram: A comparator is used to compare user-defined types.

## Working of a comparator

A comparator is a custom function or an object that defines the ordering of items, particularly when there is no natural or default order or when we want to override the ordering. Any sorting algorithm relies on repeatedly comparing pairs of elements to determine their relative order. To solve any problem involving storing complex or user-defined data types, we need to pass a comparator to the sort function to order items. Instead of relying on built-in comparison operators, the sorting algorithm calls the comparator and uses its result to determine the order of elements.

Consider an example where we have an array of instances of the class `Entry` with values `e1, e2 ... en` such that `ei < ei+1` and we need to sort them. using **bubble sort**. We create a comparator that defines the comparison logic for instances of class `Entry` and pass it to our search algorithm.

// Diagram: Bubble sort the array using a custom comparator

## Implementation

Most library implementations of the sort functions in almost all programming languages provide a way to pass a custom comparison function to define the sort order. It can either be passed as an argument to the sort function or attached to the user-defined type when defining it. Let's consider an example where the class `Entry` has two data members `x` and `y`. 

// Diagram: A user-defined type Entry has two data members x and y.

An instance will be considered greater than the other if the value of the data member `x` in it is greater than the value of `x` in the other instance. If both instances have the same value of `x` the one with greater value of `y` will be considered greater. If both `x` and `y` in the instances are equal, the instances will be considered equal.

// Diagram: The comparator compares the data member x before comparing the data member y.

Given below are different ways we can use to sort an array of instances of `Entry` as defined above.

### 1\. Operator overloading

Programming languages like C++ and Python let us override the default behaviour of most unary and binary operators. One way to define custom comparison logic for instances of user-defined types is to overload the comparison operator.

Note that we overload the `<` operator in this case, as most library sorting algorithms rely on `<` to compare elements and not the > operator.

Java, in contrast, does not support operator overloading. Instead, it allows user-defined types to specify their natural ordering by implementing the `Comparable` interface, which provides a standard way to define how instances of a class should be compared.

C++

```cpp
#include <vector>
#include <algorithms>

// Diagram: using namespace std;

struct Entry {
    int x, y;

    // Define the less-than operator for instances of Entry
    // returns true if "this" object < other
    bool operator<(const Entry& other) const {
        // First compare x
        if (x != other.x) {
            return x < other.x;
        }
        // If x is equal, compare y
        return y < other.y;
    }
};

int main() {
    vector<Entry> arr = {{4, 5}, {2, 3}, {2, 4}, {3, 5}};

    // std::sort uses the overridden < operator
    sort(arr.begin(), arr.end());
}
```

Java

```java
import java.util.*;

// Implement the Comparable interface to
// override the comparision logic
class Entry implements Comparable<Entry> {
    int x, y;
    Entry(int x, int y) { this.x = x; this.y = y; }

    // Define how two Entry objects are compared
    // Returns a -ve number if this instance < other
    // Returns 0 if this instance == other
    // Returns a +ve number if this instance > other
    @Override
    public int compareTo(Entry other) {
        // Compare x first
        if (this.x != other.x) {
            return this.x - other.x;
        }
        // If x is equal, compare y
        return this.y - other.y;
    }

public class Main {
    public static void main(String[] args) {
        List<Entry> arr = Arrays.asList(
            new Entry(4, 5),
            new Entry(2, 3),
            new Entry(2, 4),
            new Entry(3, 5)
        );

        // Uses compareTo()
        Collections.sort(arr);
    }
```

Python

```python
class Entry:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    # Define the less-than operator for instances of Entry
    # returns true if "this" object < other
    def __lt__(self, other):
        # Compare x first
        if self.x != other.x:
            return self.x < other.x
        # If x is equal, compare y
        return self.y < other.y

arr = [
    Entry(4, 5),
    Entry(2, 3),
    Entry(2, 4),
    Entry(3, 5)
]

# Uses __lt__()
arr.sort()
```

### 2\. Lambda function

Another common way to define custom sorting logic for user-defined or complex types is by using lambda functions.

A lambda function is a small, anonymous function that can be written inline, without creating a separate class or method.

Instead of embedding comparison logic in the class, lambda functions let us specify how elements are compared when sorting is performed. This method is more flexible and is especially useful when we want to sort the same data in different ways or when changing the class definition is not possible.

C++

```cpp
#include <vector>
#include <algorithms>

// Diagram: using namespace std;

struct Entry {
    int x, y;

    // Define the less-than operator for instances of Entry
    // returns true if "this" object < other
    bool operator<(const Entry& other) const {
        // First compare x
        if (x != other.x) {
            return x < other.x;
        }
        // If x is equal, compare y
        return y < other.y;
    }
};

int main() {
    vector<Entry> arr = {{4, 5}, {2, 3}, {2, 4}, {3, 5}};

    // std::sort uses the overridden < operator
    sort(arr.begin(), arr.end());
}
```

Java

```java
import java.util.*;

// Implement the Comparable interface to
// override the comparision logic
class Entry implements Comparable<Entry> {
    int x, y;
    Entry(int x, int y) { this.x = x; this.y = y; }

    // Define how two Entry objects are compared
    // Returns a -ve number if this instance < other
    // Returns 0 if this instance == other
    // Returns a +ve number if this instance > other
    @Override
    public int compareTo(Entry other) {
        // Compare x first
        if (this.x != other.x) {
            return this.x - other.x;
        }
        // If x is equal, compare y
        return this.y - other.y;
    }

public class Main {
    public static void main(String[] args) {
        List<Entry> arr = Arrays.asList(
            new Entry(4, 5),
            new Entry(2, 3),
            new Entry(2, 4),
            new Entry(3, 5)
        );

        // Uses compareTo()
        Collections.sort(arr);
    }
```

Typescript

```typescript
class Entry { x: number; y: number; }

const arr: Entry[] = [
  { x: 4, y: 5 },
  { x: 2, y: 3 },
  { x: 2, y: 4 },
  { x: 3, y: 5 }
];

// Lambda comparator
arr.sort((a: Entry, b: Entry): number => {
  // Returns a -ve number if a < b
  // Returns 0 if a == b
  // Returns a +ve number if a > b
  if (a.x !== b.x) {
    return a.x - b.x;
  }
  return a.y - b.y;
});
```

Javascript

```javascript
const arr = [
  { x: 4, y: 5 },
  { x: 2, y: 3 },
  { x: 2, y: 4 },
  { x: 3, y: 5 }
];

// Lambda comparator
arr.sort((a, b) => {
  // Returns a -ve number if a < b
  // Returns 0 if a == b
  // Returns a +ve number if a > b
  if (a.x !== b.x) {
    return a.x - b.x;
  }
  return a.y - b.y;
});
```

Python

```python
class Entry:
    def __init__(self, x, y):
        self.x = x
        self.y = y

arr = [
    Entry(4, 5),
    Entry(2, 3),
    Entry(2, 4),
    Entry(3, 5)
]

# Option 1 -> Lambda key function with "one" agrument:
# Returns a value used as the sort key; elements are ordered
# based on the natural ordering (ascending order) of this returned value
arr.sort(key=lambda e: (e.x, e.y))

# Option 2 -> Lambda key function with "two" agrument:
# Returns a -ve number if a < b
# Returns 0 if a == b
# Returns a +ve number if a > b
arr.sort(key=lambda a, b: (a.x - b.x) if a.x != b.x else (a.y - b.y))
```

### 3\. Custom comparator object

Similar to a lambda function, most programming languages also allow passing a comparator object instead of a function. A comparator object is a separate class or object that defines how two elements should be compared. Instead of embedding the comparison logic inside the class or writing it inline as a lambda, a comparator object keeps the rules in a reusable, named structure. This object can then be passed to the sorting function wherever needed, keeping the flexibility of a lambda while providing the encapsulation of a class.

This method is especially useful when changing the class definition is not possible, and the same type of data needs to be sorted in different parts of a program, or when the comparison logic is complex and better organized in its own class.

C++

```cpp
#include <vector>
#include <algorithms>

// Diagram: using namespace std;

struct Entry {
    int x, y;

    // Define the less-than operator for instances of Entry
    // returns true if "this" object < other
    bool operator<(const Entry& other) const {
        // First compare x
        if (x != other.x) {
            return x < other.x;
        }
        // If x is equal, compare y
        return y < other.y;
    }
};

int main() {
    vector<Entry> arr = {{4, 5}, {2, 3}, {2, 4}, {3, 5}};

    // std::sort uses the overridden < operator
    sort(arr.begin(), arr.end());
}
```

Java

```java
import java.util.*;

// Implement the Comparable interface to
// override the comparision logic
class Entry implements Comparable<Entry> {
    int x, y;
    Entry(int x, int y) { this.x = x; this.y = y; }

    // Define how two Entry objects are compared
    // Returns a -ve number if this instance < other
    // Returns 0 if this instance == other
    // Returns a +ve number if this instance > other
    @Override
    public int compareTo(Entry other) {
        // Compare x first
        if (this.x != other.x) {
            return this.x - other.x;
        }
        // If x is equal, compare y
        return this.y - other.y;
    }

public class Main {
    public static void main(String[] args) {
        List<Entry> arr = Arrays.asList(
            new Entry(4, 5),
            new Entry(2, 3),
            new Entry(2, 4),
            new Entry(3, 5)
        );

        // Uses compareTo()
        Collections.sort(arr);
    }
```

Typescript

```typescript
class Entry { x: number; y: number; }

const arr: Entry[] = [
  { x: 4, y: 5 },
  { x: 2, y: 3 },
  { x: 2, y: 4 },
  { x: 3, y: 5 }
];

// Comparator object with compare method
class EntryComparator {
  compare(a: Entry, b: Entry): number {
    // Returns a -ve number if a < b
    // Returns 0 if a == b
    // Returns a +ve number if a > b
    if (a.x !== b.x) return a.x - b.x;
    return a.y - b.y;
  }

const comparator = new EntryComparator();
arr.sort((a, b) => comparator.compare(a, b)); // Pass comparator method
```

Javascript

```javascript
const arr = [
  { x: 4, y: 5 },
  { x: 2, y: 3 },
  { x: 2, y: 4 },
  { x: 3, y: 5 }
];

// Comparator object with compare method
class EntryComparator {
  compare(a, b) {
    // Returns a -ve number if a < b
    // Returns 0 if a == b
    // Returns a +ve number if a > b
    if (a.x !== b.x) return a.x - b.x;
    return a.y - b.y;
  }

const comparator = new EntryComparator();
arr.sort((a, b) => comparator.compare(a, b)); // Pass comparator method
```

Python

```python
from functools import cmp_to_key

class Entry:
    def __init__(self, x, y):
        self.x = x
        self.y = y

# Comparator object as a class
class EntryComparator:
    def __call__(self, a, b):
        # Returns a -ve number if a < b
        # Returns 0 if a == b
        # Returns a +ve number if a > b
        if a.x != b.x:
            return a.x - b.x
        return a.y - b.y

// Diagram: arr = [Entry(4,5), Entry(2,3), Entry(2,4), Entry(3,5)]

# Pass instance to cmp_to_key
# cmp_to_key converts the two-argument comparator into a key function Python’s sort() can use
arr.sort(key=cmp_to_key(EntryComparator()))
```

***

# Understanding the custom compare pattern

Sorting a sequence of data arranges them in their natural order, defined by the `<` and `>` operators. However, there are some problems that require ordering user-defined or complex data types that do not have inherent ordering. In most cases, to solve these problems, we first define the new data type and then create a comparator to specify the ordering logic for its sorting.

The custom compare pattern is a classification of problems that can be solved using any sorting algorithm with a custom comparator.

In this lesson, we will learn more about using the custom compare technique to solve problems and how to identify a problem as a custom compare pattern problem.

## The custom compare technique

Consider an array of integers `arr`, a user-defined type `Entry`, and a transformation function `t`. The function `t` maps each value in the array to an instance of the user-defined type `Entry`. For this example, consider the generic array of values given below.

// Diagram: A generic array of values.

For this example, we will consider the user-defined type `Entry` has two data members `x` and `y`. An instance of `Entry` is considered greater than the other if the value of `x` in it is greater than that of the other. If the value of `x` is the same in both, then the one with the greater value of `y` is considered greater.

// Diagram: A user-defined type Entry.

For this example, consider the transformation function below that converts the array into an array of instances of `Entry` where we have generic values `xi` and `yi` of `x` and `y` such that `xi < xi+1` and `yi < yi+1` for all `1 < i < N`.

// Diagram: Corresponding Entry mapping for all array values.

The goal is to sort the array so that its elements appear in the same order as they would if the transformed values were sorted according to the user-defined type’s ordering.

// Diagram: Sort the array arr based according to the transformed values of its elements.

There are multiple ways to solve the problem, depending on the complexity of the transformation function `t`.

### 1\. Sort with transformation on the fly

If the transformation function is simple, we can create a custom comparator for the primitive data type (integer in this case) in the array that applies the function t to both inputs and compares them to determine the correct order. We then pass this comparator to the library's sort function, which sorts the array of integers `arr` by their transformed `Entry` values.

The execution of bubble sort on this array, transforming entries on the fly and using a custom comparator to sort the array, is given below.

// Diagram: Bubble sort by transforming data on the fly using the function t

The implementation of this technique using the library sort function with a stub implementation of the function `t` is given below.

C++

```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    struct Entry {
        int x;
        int y;
    };

    // Transformation function t
    Entry t(int value) {
        return Entry{value, value * value};
    }

    // Entry point
    void customCompare(vector<int>& arr) {
        // Step 1: Create transformed array of (Entry, int) pairs
        vector<pair<Entry, int>> transformedArr;
        for (int v : arr) {
            transformedArr.push_back({t(v), v});
        }

        // Step 2: Sort based only on Entry
        sort(transformedArr.begin(), transformedArr.end(),
            [](const pair<Entry, int>& a, const pair<Entry, int>& b) {
                if (a.first.x != b.first.x)
                    return a.first.x < b.first.x;
                return a.first.y < b.first.y;
            });

        // Step 3: Overwrite original array
        for (size_t i = 0; i < arr.size(); i++) {
            arr[i] = transformedArr[i].second;
        }
};
```

Java

```java
import java.util.*;

// Diagram: class Solution {

    class Entry {
        int x, y;
        Entry(int x, int y) {
            this.x = x;
            this.y = y;
        }

    // Transformation function t
    Entry t(int value) {
        return new Entry(value, value * value);
    }

    // Entry point
    void customCompare(List<Integer> arr) {
        arr.sort((a, b) -> {
            // Convert a and b to Entry using transformation function t
            Entry ea = t(a);
            Entry eb = t(b);

            // Returns a negative value if 'a' comes before 'b',
            // zero if equal, positive otherwise
            if (ea.x != eb.x)
                return ea.x - eb.x;
            return ea.y - eb.y;
        });
    }
```

Typescript

```typescript
interface Entry {
  x: number;
  y: number;
}

// Diagram: class Solution {

  // Transformation function t
  t(value: number): Entry {
    return { x: value, y: value * value };
  }

  // Entry point
  customCompare(arr: number[]): void {
    arr.sort((a: number, b: number): number => {
      // Convert a and b to Entry using transformation function t
      const ea: Entry = this.t(a);
      const eb: Entry = this.t(b);

      // Returns a negative value if 'a' comes before 'b',
      // zero if equal, positive otherwise
      if (ea.x !== eb.x) {
        return ea.x - eb.x;
```

Javascript

```javascript
class Solution {

  // Transformation function t
  t(value) {
    return { x: value, y: value * value };
  }

  // Entry point
  customCompare(arr) {
    arr.sort((a, b) => {
      // Convert a and b to Entry using transformation function t
      const ea = this.t(a);
      const eb = this.t(b);

      // Returns a negative value if 'a' comes before 'b',
      // zero if equal, positive otherwise
      if (ea.x !== eb.x) {
        return ea.x - eb.x;
      }
      return ea.y - eb.y;
    });
  }
```

Python

```python
from functools import cmp_to_key

class Solution:

    class Entry:
        def __init__(self, x: int, y: int) -> None:
            self.x: int = x
            self.y: int = y

    # Transformation function t
    def t(self, value: int) -> "Solution.Entry":
        return Solution.Entry(value, value * value)

    # Entry point
    def customCompare(self, arr: list[int]) -> None:
        def compare(a: int, b: int) -> int:
            # Convert a and b to Entry using transformation function t
            ea: Solution.Entry = self.t(a)
            eb: Solution.Entry = self.t(b)

            # Returns negative if 'a' comes before 'b',
            # zero if equal, positive otherwise
            if ea.x != eb.x:
                return ea.x - eb.x
            return ea.y - eb.y

        arr.sort(key=cmp_to_key(compare))
```

### 2\. Transform and then sort

If the transformation function is complex, or requires some state and cannot be applied on the fly, we create an array `transformedArr` of pairs of instances of `Entry` and their corresponding integer value in `arr`. We then create a custom comparator for the (Entry, integer) pair that compares only the `Entry` part of the pair and returns the correct order.

We then sort `transformedArr` using the custom comparator. Next, we iterate over the sorted `transformedArr` and overwrite the corresponding items in `arr` with the second (integer) part of the pair in `transformedArr`.

// Diagram: Bubble sort by creating a transformed array using the function t

The implementation of this technique using the library sort function with a stub implementation of the function `t` is given below.

C++

```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    struct Entry {
        int x;
        int y;
    };

    // Transformation function t
    Entry t(int value) {
        return Entry{value, value * value};
    }

    // Entry point
    void customCompare(vector<int>& arr) {
        // Step 1: Create transformed array of (Entry, int) pairs
        vector<pair<Entry, int>> transformedArr;
        for (int v : arr) {
            transformedArr.push_back({t(v), v});
        }

        // Step 2: Sort based only on Entry
        sort(transformedArr.begin(), transformedArr.end(),
            [](const pair<Entry, int>& a, const pair<Entry, int>& b) {
                if (a.first.x != b.first.x)
                    return a.first.x < b.first.x;
                return a.first.y < b.first.y;
            });

        // Step 3: Overwrite original array
        for (size_t i = 0; i < arr.size(); i++) {
            arr[i] = transformedArr[i].second;
        }
};
```

Java

```java
import java.util.*;

// Diagram: class Solution {

    class Entry {
        int x, y;
        Entry(int x, int y) {
            this.x = x;
            this.y = y;
        }

    // Transformation function t
    Entry t(int value) {
        return new Entry(value, value * value);
    }
    // Entry point
    void customCompare(List<Integer> arr) {
        // Step 1: Create transformed list of (Entry, Integer) pairs
        List<Map.Entry<Entry, Integer>> transformedArr = new ArrayList<>();
        for (int v : arr) {
            transformedArr.add(new AbstractMap.SimpleEntry<>(t(v), v));
        }

        // Step 2: Sort based only on Entry
        transformedArr.sort((a, b) -> {
            if (a.getKey().x != b.getKey().x)
                return a.getKey().x - b.getKey().x;
            return a.getKey().y - b.getKey().y;
        });

        // Step 3: Overwrite original list
        for (int i = 0; i < arr.size(); i++) {
            arr.set(i, transformedArr.get(i).getValue());
        }
```

Typescript

```typescript
interface Entry {
  x: number;
  y: number;
}

// Diagram: class Solution {

  // Transformation function t
  t(value: number): Entry {
    return { x: value, y: value * value };
  }

  // Entry point
  customCompare(arr: number[]): void {
    // Step 1: Create transformed array of [Entry, number]
    const transformedArr: [Entry, number][] =
      arr.map(v => [this.t(v), v]);

    // Step 2: Sort based only on Entry
    transformedArr.sort((a, b) => {
      if (a[0].x !== b[0].x) return a[0].x - b[0].x;
      return a[0].y - b[0].y;
    });

    // Step 3: Overwrite original array
    for (let i = 0; i < arr.length; i++) {
      arr[i] = transformedArr[i][1];
    }
```

Javascript

```javascript
class Solution {

  // Transformation function t
  t(value) {
    return { x: value, y: value * value };
  }

  // Entry point
  customCompare(arr) {
    arr.sort((a, b) => {
      // Convert a and b to Entry using transformation function t
      const ea = this.t(a);
      const eb = this.t(b);

      // Returns a negative value if 'a' comes before 'b',
      // zero if equal, positive otherwise
      if (ea.x !== eb.x) {
        return ea.x - eb.x;
      }
      return ea.y - eb.y;
    });
  }
```

Python

```python
from functools import cmp_to_key

class Solution:

    class Entry:
        def __init__(self, x: int, y: int) -> None:
            self.x: int = x
            self.y: int = y

    # Transformation function t
    def t(self, value: int) -> "Solution.Entry":
        return Solution.Entry(value, value * value)

    # Entry point
    def customCompare(self, arr: list[int]) -> None:
        def compare(a: int, b: int) -> int:
            # Convert a and b to Entry using transformation function t
            ea: Solution.Entry = self.t(a)
            eb: Solution.Entry = self.t(b)

            # Returns negative if 'a' comes before 'b',
            # zero if equal, positive otherwise
            if ea.x != eb.x:
                return ea.x - eb.x
            return ea.y - eb.y

        arr.sort(key=cmp_to_key(compare))
```

***

# Identifying the custom compare pattern

There are many problems we need to sort sequences of primitive data types based on the ordering of a user-defined type that has no inherent ordering, or we may have to sort a sequence of some user-defined data type. These are generally **easy** or **medium** problems where we transform the primitive data type to some user-defined type using a transformation function `t` and apply some problem-specific rules to define the ordering between elements. The ultimate goal of the problem is usually to sort the original sequence according to the ordering of the transformed data.

If the problem statement or its solution follows the generic template below, it can be solved using the custom compare technique.

**Template:**

Given a sequence of data items and a transformation function `t`, sort the sequence using the transformed values of the elements.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the custom compare technique.

> **Problem statement:** Given a string `s`, that contains upper case and lowercase English letters. Sort the string in decreasing order of frequency of characters. For characters with the same frequency, the lexicographically smaller one should come first

// Diagram: Sort the string by frequency of characters and then lexicographically.

## The custom compare solution

We need to know the frequency of the characters in the string to compare them for sorting. We can then transform every character to its frequency before comparing them to get the right order. The solution to the problem fits the template for the custom compare pattern.

**Template:**Given a sequence of data items (`s`) and a transformation function `t` (character to frequency), sort the sequence using the transformed values of the elements.

To solve this problem, we create a hash map `frequency` that maps every character to its frequency. We then iterate in the string from start to end, and in each iteration, increment the count of the character in the `frequency` map. This way, at the end of all iterations, the `frequency` map contains the frequency of each character in the string.

// Diagram: Compute the frequency of unique characters

To sort the string, we create a custom comparator that takes the two characters `a` and `b` from the string, computes their frequencies using the `frequency` map, and prioritises the one with a higher frequency. If the frequencies of both `a` and `b` are the same, it prioritises the lexicographically smaller character.

In the example execution below, we use bubble sort to demonstrate how the custom comparison works; however, the implementation can use any sorting algorithm.

// Diagram: Bubble sort the string based on frequency of characters

The implementation of the custom compare solution to solve the problem is given below.

C++

```cpp
#include <algorithm>
#include <unordered_map>

// Diagram: using namespace std;

// Define a struct to represent a character and its frequency
struct CharFrequency {
    char character;
    int frequency;
};

struct Compare {
    bool operator()(const CharFrequency &a, const CharFrequency &b) {

        // Compare the frequencies of characters 'a' and 'b'
        // If the frequency of 'a' is greater than the frequency of
        // 'b', or if the frequencies are equal but 'a' comes before
        // 'b' in lexicographical order, then 'a' should come before
        // 'b' in the sorted string.
        return a.frequency > b.frequency ||
               (a.frequency == b.frequency && a.character < b.character);
    }
};

class Solution {
public:
    string sortCharactersByFrequency(string s) {

        // Create an unordered_map to store character frequencies
        unordered_map<char, int> frequency;

        // Count the frequencies of each character in the input string
        for (char ch : s) {
            frequency[ch]++;
        }

        // Store characters and their frequencies in a vector of
        // CharFrequency objects
        vector<CharFrequency> charFrequency;
        for (const auto &entry : frequency) {
            charFrequency.push_back({entry.first, entry.second});
        }

        // Sort the vector using the Comparator struct
        sort(charFrequency.begin(), charFrequency.end(), Compare());

        // Build the sorted string
        string result;
        for (const auto &p : charFrequency) {

            // Append 'p.frequency' occurrences of 'p.character'
            result.append(p.frequency, p.character);
        }

        return result;
    }
};
```

Java

```java
import java.util.*;

// Define an internal class to represent a character and its frequency
class CharFreq {

    char character;
    int frequency;

    // Constructor to initialize CharFreq
    public CharFreq(char character, int frequency) {
        this.character = character;
        this.frequency = frequency;
    }

// Define the comparator to sort CharFreq based on frequency and
// lexicographical order
class Compare implements Comparator<CharFreq> {
    public int compare(CharFreq a, CharFreq b) {

        // Compare the frequencies of characters 'a' and 'b'
        // If the frequency of 'a' is greater than the frequency of
        // 'b', or if the frequencies are equal but 'a' comes before
        // 'b' in lexicographical order, then 'a' should come before
        // 'b' in the sorted string.
        if (a.frequency == b.frequency) {
            return Character.compare(a.character, b.character);
        }

        // Sort by frequency descending
        return Integer.compare(b.frequency, a.frequency);
    }

class Solution {
    public String sortCharactersByFrequency(String s) {

        // Create a hashmap to store the frequency of characters
        Map<Character, Integer> frequency = new HashMap<>();

        // Count the frequencies of each character in the input string
        for (char ch : s.toCharArray()) {
            frequency.put(ch, frequency.getOrDefault(ch, 0) + 1);
        }

        // Store characters and their frequencies in a list of CharFreq
        // objects
        List<CharFreq> charFreq = new ArrayList<>();
        for (var entry : frequency.entrySet()) {
            charFreq.add(new CharFreq(entry.getKey(), entry.getValue()));
        }

        // Sort the list using the custom comparator
        charFreq.sort(new Compare());

        // Build the sorted string
        StringBuilder result = new StringBuilder();
        for (CharFreq cf : charFreq) {

            // Append 'cf.frequency' occurrences of 'cf.character'
            for (int i = 0; i < cf.frequency; i++) {
                result.append(cf.character);
            }

        return result.toString();
    }
```

Typescript

```typescript
// Define a class to represent a character and its frequency
class CharFreq {
    character: string;
    frequency: number;

    constructor(character: string, frequency: number) {
        this.character = character;
        this.frequency = frequency;
    }

// Sorts by frequency first, and then lexicographically
function comparator(a: CharFreq, b: CharFreq): number {

    // Compare the frequencies of characters 'a' and 'b'
    // If the frequency of 'a' is greater than the frequency of
    // 'b', or if the frequencies are equal but 'a' comes before
    // 'b' in lexicographical order, then 'a' should come before
    // 'b' in the sorted string.
    if (a.frequency === b.frequency) {
        return a.character.charCodeAt(0) - b.character.charCodeAt(0);
    }
```

Javascript

```javascript
// Define a class to represent a character and its frequency
class CharFreq {
    character: string;
    frequency: number;

    constructor(character: string, frequency: number) {
        this.character = character;
        this.frequency = frequency;
    }

// Sorts by frequency first, and then lexicographically
function comparator(a: CharFreq, b: CharFreq): number {

    // Compare the frequencies of characters 'a' and 'b'
    // If the frequency of 'a' is greater than the frequency of
    // 'b', or if the frequencies are equal but 'a' comes before
    // 'b' in lexicographical order, then 'a' should come before
    // 'b' in the sorted string.
    if (a.frequency === b.frequency) {
        return a.character.charCodeAt(0) - b.character.charCodeAt(0);
    }
```

Python

```python
from collections import Counter

class Solution:
    def sort_characters_by_frequency(self, s: str) -> str:

        # Create a dictionary to store character frequencies
        frequency = Counter(s)

        # Sort characters based on frequency (descending),
        # and lexicographical order in case of ties
        char_freq = sorted(
            frequency.items(), key=lambda x: (-x[1], x[0])
        )

        # Build the sorted string
        result = "".join(char * freq for char, freq in char_freq)

        return result
```

## Example problems

Most problems that fall under this category are**easy** or **medium**problems; a list of a few is given below.

> -   **[Bitwise sort](https://www.codeintuition.io/courses/sorting/kGQPICWk2CXuiJkx6HyeZ)**
> -   **[Sort characters by frequency](https://www.codeintuition.io/courses/sorting/LtTrPlgTKc-9tNFZ8ZIcV)**
> -   **[Largest number](https://www.codeintuition.io/courses/sorting/ANzky0r0VbE8PHhwPnGun)**
> -   **[Sort people by height](https://www.codeintuition.io/courses/sorting/My573FzAXiSkAmpe5W5UA)**

We will now solve these problems to gain a deeper understanding of the custom compare pattern.

***

# Bitwise sort

## Problem Statement

Given an integer array **arr**, write a function that sorts the number in ascending order based on the number of `1's` in their binary representation. If two or more numbers have the same number of `1's`, sort them based on their value. You must do this **in place**.

### Example 1

> -   **Input:** arr = \[7, 10, 12, 18, 26\]
> -   **Output:** \[10, 12, 18, 7, 26\]
> -   **Explanation:** Above is the sorted array based on the number of 1's in their binary representation.

### Example 2

> -   **Input:** arr = \[3, 7, 10, 18, 2, 9, 15, 31\]
> -   **Output:** \[2, 3, 9, 10, 18, 7, 15, 31\]
> -   **Explanation:** Above is the sorted array based on the number of 1's in their binary representation.

### Example 3

> -   **Input:** arr = \[1, 2, 4, 8, 16\]
> -   **Output:** \[1, 2, 4, 8, 16\]
> -   **Explanation:** Above is the sorted array based on the number of 1's in their binary representation.

## Solution

```cpp
#include <algorithm>

using namespace std;

class Solution {
public:
    void bitwiseSort(vector<int> &arr) {
        sort(
            arr.begin(),
            arr.end(),
            [](const int &num1, const int &num2) {

                // Count set bits in 'num1' using built-in function
                int setBitCountNum1 = __builtin_popcount(num1);

                // Count set bits in 'num2' using built-in function
                int setBitCountNum2 = __builtin_popcount(num2);

                // Sort by set bit count, if equal, sort by the actual
                // number
                return setBitCountNum1 < setBitCountNum2 ||
                       (setBitCountNum1 == setBitCountNum2 &&
                        num1 < num2);
            }
        );
    }
};
```

***

# Sort characters by frequency

## Problem Statement

Given a string **s** that consists of lowercase and uppercase English alphabets, write a function that sorts the string based on the frequency of the characters. 

If two characters have the same frequency, the one that is lexicographically smaller should come first.

### Example 1

> -   **Input:** s = eeeaaabc
> -   **Output:** aaaeeebc
> -   **Explanation:** Above is the string when sorted by the frequency of characters.

### Example 2

> -   **Input:** s = zzzxxyyyb
> -   **Output:** yyyzzzxxb
> -   **Explanation:** Above is the string when sorted by the frequency of characters.

### Example 3

> -   **Input:** s = zzzxxyyb
> -   **Output:** zzzxxyyb
> -   **Explanation:** The string is already sorted by the order of frequency.

## Solution

```cpp
#include <algorithm>
#include <unordered_map>

using namespace std;

class Solution {
public:
    string sortCharactersByFrequency(string s) {

        // Create an unordered_map to store character frequencies
        unordered_map<char, int> frequency;

        // Count the frequencies of each character in the input string
        for (char ch : s) {
            frequency[ch]++;
        }

        // Sort the string in-place using a lambda function
        sort(s.begin(), s.end(), [&](char a, char b) {

            // Compare the frequencies of characters 'a' and 'b'
            // If the frequency of 'a' is greater than the frequency of
            // 'b', or if the frequencies are equal but 'a' comes before
            // 'b' in lexicographical order, then 'a' should come before
            // 'b' in the sorted string.
            return frequency[a] > frequency[b] ||
                   (frequency[a] == frequency[b] && a < b);
        });

        // The string 's' is now sorted in-place by frequency
        return s;
    }
};
```

***

# Largest number

## Problem Statement

Given an array of non-negative numbers **arr**, write a function to concatenate these numbers to form the largest number. Since the output could go out of bounds, return a string result.

### Example 1

> -   **Input:** arr = \[200, 3\]
> -   **Output:** 3200
> -   **Explanation:** Above is the largest number that can be formed.

### Example 2

> -   **Input:** arr = \[200, 8, 1, 3\]
> -   **Output:** 832001
> -   **Explanation:** Above is the largest number that can be formed.

### Example 3

> -   **Input:** arr = \[50, 20, 10, 5\]
> -   **Output:** 5502010
> -   **Explanation:** Above is the largest number that can be formed.

## Solution

```cpp
#include <algorithm>

using namespace std;

class Solution {
public:
    string largestNumber(vector<int> &arr) {

        // Sort the numbers using a custom lambda comparator
        sort(
            arr.begin(),
            arr.end(),
            [](const int &num1, const int &num2) {
                string num1Str = to_string(num1);
                string num2Str = to_string(num2);

                // Larger concatenation comes first
                return num1Str + num2Str > num2Str + num1Str;
            }
        );

        // Edge case: If the largest number is '0', return "0"
        // (e.g., [0, 0])
        if (arr[0] == 0) {
            return "0";
        }

        // Concatenate the sorted numbers
        string result;
        for (int num : arr) {
            result += to_string(num);
        }

        return result;
    }
};
```

***

# Sort people by height

## Problem Statement

You are given an array called **people**, where `people[i]` represents a pair `(hi, ki)` that indicates the height of the `ith` person and the number of people standing in front of them whose height is greater than or equal to `hi`. However, this queue is not in the correct order as defined by this property. Write a function to sort this queue to ensure it is ordered according to the specified criteria.

### Example 1

> -   **Input:** people = \[\[5, 1\], \[5, 0\]\]
> -   **Output:** \[\[5, 0\], \[5, 1\]\]
> -   **Explanation:** Above is the correct order of people.

### Example 2

> -   **Input:** people = \[\[1, 4\], \[2, 3\], \[3, 2\], \[4, 1\], \[5, 0\]\]
> -   **Output:** \[\[5, 0\], \[4, 1\], \[3, 2\], \[2, 3\], \[1, 4\]\]
> -   **Explanation:** Above is the correct order of people.

### Example 3

> -   **Input:** people = \[\[5, 0\], \[4, 1\], \[3, 2\], \[2, 3\], \[1, 4\]\]
> -   **Output:** \[\[5, 0\], \[4, 1\], \[3, 2\], \[2, 3\], \[1, 4\]\]
> -   **Explanation:** People are already standing in the correct order.

## Solution

```cpp
#include <algorithm>

using namespace std;

class Solution {
public:
    vector<vector<int>> sortPeopleByHeight(vector<vector<int>> &people) {

        // Step 1: Sort the people array using a custom lambda comparator
        sort(
            people.begin(),
            people.end(),
            [](const vector<int> &person1, const vector<int> &person2) {

                // Sort by height in descending order, if same height,
                // sort by k in ascending order
                return (person1[0] > person2[0]) ||
                       (person1[0] == person2[0] &&
                        person1[1] < person2[1]);
            }
        );

        // Step 2: Reconstruct the queue by inserting people at their
        // respective positions
        vector<vector<int>> result;
        for (auto &person : people) {
            result.insert(result.begin() + person[1], person);
        }

        return result;
    }
};
```
