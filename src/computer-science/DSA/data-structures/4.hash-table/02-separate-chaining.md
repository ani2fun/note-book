# 2. Separate chaining

## Table of contents

1. [Introduction to separate chaining](#introduction-to-separate-chaining)
2. [Key components of separate chaining](#key-components-of-separate-chaining)
3. [Implementing the hash table class](#implementing-the-hash-table-class)
4. [Search operation in separate chaining](#search-operation-in-separate-chaining)
5. [Insert operation in separate chaining](#insert-operation-in-separate-chaining)
6. [Delete operation in separate chaining](#delete-operation-in-separate-chaining)
7. [Design a hash table with separate chaining](#design-a-hash-table-with-separate-chaining)

***

# Introduction to separate chaining

Now that we know what a hash table is and the operations it supports, we can dive deeper into how hash tables deal with collisions. Separate chaining is one such way of collision resolution in hash tables. As the name suggests, the internal array is an array of a chain-like data structure in the separate chaining implementation of a hash table. This data structure can simultaneously hold more than one data item, which is exactly how collisions are resolved. All the keys with the same hash value are stored at the hashed index, forming a data chain.

// Diagram: Logical representation of separate chaining implementation of a hash table

We can implement the chain using a linked list, dynamic array, or a self-balancing binary search tree as the data structure. The most common separate chaining implementation uses a doubly linked list, which we will use in this course.

Separate chaining is sometimes called **closed addressing** or **open hashing** because collisions are handled using another data structure (a linked list). 

## Advantages

The separate chaining implementation can easily resolve collision in hash tables and is the most intuitive way to solve this problem. It has a few advantages over other collision resolution schemes that we will learn later in this course.

> -   **Easy**: Separate chaining is easier to understand and implement than other collision resolution schemes, which we will learn later.
> -   **Infinite size**: There is no restriction on the hash table size. The chain data structure can grow as much as memory permits.
> -   **Collision performance**: Unlike other collision resolution schemes, in separate chaining, collision on one hashed index does not affect the other hashed indices.

## Limitations

Even though the separate chaining implementation is easy to understand and intuitive, it is not always the best choice for implementing hash tables. It has a few limitations over other collision resolution schemes.

> -   **Infinite size**: No size restriction can lead to unchecked hash table expansion, causing out-of-memory (OOM) issues.
> -   **Extra space**: The data structure used for chaining has its data members, such as previous and next references, in doubly linked lists that use extra space.
> -   **CPU cache performance**: When using a chain data structure, the data is scattered throughout the memory, and so the CPU cache performance is poor as it cannot leverage the locality of reference as in arrays.

We will look at the different components that make up the hash table, which uses separate chaining collision resolution using a doubly linked list.

***

# Key components of separate chaining

Now that we know what separate chaining is let us look at the structure of a separate chaining implementation of a hash table using a **doubly linked list**. The hash table is just an encapsulation around an array of linked lists that stores key-value pairs. Different pieces have to be put together to create a hash table. Let us look at all the components and functions needed to implement such a hash table.

## Record

Each linked list node stores the key-value pair that represents the mapping in the separate chaining implementation of a hash table. A record is a data structure encapsulating this key-value pair, making it easy to use and operate. Each node in the linked list holds data in this format.

// Diagram: A record in the separate chaining implementation of a hash table

We create a class with key and value as its data members to implement this data structure. The class provides a parameterized constructor to supply values during construction.

C++

```cpp
// Represents an entry in the hash table
struct Record {
    int key;
    int value;

    Record() = default;
    Record(int key, int value) : key(key), value(value) {}
};

// Definition for doubly-linked list.
struct ListNode {
    Record val;
    ListNode *prev;
    ListNode *next;
    ListNode(Record val) : val(val), prev(nullptr), next(nullptr) {}
};
```

Java

```java
// Represents an entry in the hash table
class Record {
    int key;
    int value;

    Record(int key, int value) {
        this.key = key;
        this.value = value;
    }

// Definition for doubly-linked list.
class ListNode {
    Record val;
    ListNode prev;
    ListNode next;
    ListNode() {}
    ListNode(Record val) { this.val = val; }
};
```

Typescript

```typescript
// Represents an entry in the hash table
class Record {
    key: number;
    value: number;

    constructor(key: number, value: number) {
        this.key = key;
        this.value = value;
    }

// Definition for doubly-linked list.
class ListNode {
    val: Record
    prev: ListNode | null
    next: ListNode | null
    constructor(
        val?: Record,
        prev?: ListNode | null,
        next?: ListNode | null
    ) {
        this.val = (val===undefined ? null : val)
        this.prev = (prev===undefined ? null : prev)
        this.next = (next===undefined ? null : next)
    }
```

Javascript

```javascript
// Represents an entry in the hash table
class Record {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

// Definition for doubly-linked list.
function ListNode(val, prev, next) {
    this.val = (val===undefined ? null : val)
    this.prev = (prev===undefined ? null : prev)
    this.next = (next===undefined ? null : next)
}
```

Python

```python
# Represents an entry in the hash table
class Record:
    def __init__(self, key: int, value: int):
        self.key = key
        self.value = value

# Definition for doubly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None
```

## Internal array

In the separate chaining implementation of a hash table, the internal array is an array of linked lists. Each index in the array represents a hash value, and the linked list at the index stores all the records that have keys with the same hash value(collision).

// Diagram: The internal array is an array of linked lists

When a hash table is created, all linked lists are empty. Adding mappings to the hash table adds new nodes to the linked lists at the hashed indices. Later in the course, we will learn more about the different operations on a hash table implemented using separate chaining.

// Diagram: As the mappings are added to the hash table, new nodes are added to lists at the hashed indices

To keep the implementation simple, we use the library implementation of a linked list instead of using the `ListNode` class we created in the doubly linked list course.

C++

```cpp
// Represents an entry in the hash table
struct Record {
    int key;
    int value;

    Record() = default;
    Record(int key, int value) : key(key), value(value) {}
};

// Definition for doubly-linked list.
struct ListNode {
    Record val;
    ListNode *prev;
    ListNode *next;
    ListNode(Record val) : val(val), prev(nullptr), next(nullptr) {}
};
```

Java

```java
// Represents an entry in the hash table
class Record {
    int key;
    int value;

    Record(int key, int value) {
        this.key = key;
        this.value = value;
    }

// Definition for doubly-linked list.
class ListNode {
    Record val;
    ListNode prev;
    ListNode next;
    ListNode() {}
    ListNode(Record val) { this.val = val; }
};
```

Typescript

```typescript
// Represents an entry in the hash table
class Record {
    key: number;
    value: number;

    constructor(key: number, value: number) {
        this.key = key;
        this.value = value;
    }

// Definition for doubly-linked list.
class ListNode {
    val: Record
    prev: ListNode | null
    next: ListNode | null
    constructor(
        val?: Record,
        prev?: ListNode | null,
        next?: ListNode | null
    ) {
        this.val = (val===undefined ? null : val)
        this.prev = (prev===undefined ? null : prev)
        this.next = (next===undefined ? null : next)
    }
```

Javascript

```javascript
// Represents an entry in the hash table
class Record {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

// Definition for doubly-linked list.
function ListNode(val, prev, next) {
    this.val = (val===undefined ? null : val)
    this.prev = (prev===undefined ? null : prev)
    this.next = (next===undefined ? null : next)
}
```

Python

```python
# Represents an entry in the hash table
class Record:
    def __init__(self, key: int, value: int):
        self.key = key
        self.value = value

# Definition for doubly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None
```

## Hash function

The hash function is the heart of any hash table. It converts a given key to an index (hash value) in the internal array. The key-value pair is searched, inserted, or deleted in the internal array at that index. Any hash-value collision is resolved using separate chaining (adding to the linked list).

// Diagram: The hash function translates keys to array indices

C++

```cpp
// Represents an entry in the hash table
struct Record {
    int key;
    int value;

    Record() = default;
    Record(int key, int value) : key(key), value(value) {}
};

// Definition for doubly-linked list.
struct ListNode {
    Record val;
    ListNode *prev;
    ListNode *next;
    ListNode(Record val) : val(val), prev(nullptr), next(nullptr) {}
};
```

Java

```java
// Represents an entry in the hash table
class Record {
    int key;
    int value;

    Record(int key, int value) {
        this.key = key;
        this.value = value;
    }

// Definition for doubly-linked list.
class ListNode {
    Record val;
    ListNode prev;
    ListNode next;
    ListNode() {}
    ListNode(Record val) { this.val = val; }
};
```

Typescript

```typescript
// Represents an entry in the hash table
class Record {
    key: number;
    value: number;

    constructor(key: number, value: number) {
        this.key = key;
        this.value = value;
    }

// Definition for doubly-linked list.
class ListNode {
    val: Record
    prev: ListNode | null
    next: ListNode | null
    constructor(
        val?: Record,
        prev?: ListNode | null,
        next?: ListNode | null
    ) {
        this.val = (val===undefined ? null : val)
        this.prev = (prev===undefined ? null : prev)
        this.next = (next===undefined ? null : next)
    }
```

Javascript

```javascript
// Represents an entry in the hash table
class Record {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

// Definition for doubly-linked list.
function ListNode(val, prev, next) {
    this.val = (val===undefined ? null : val)
    this.prev = (prev===undefined ? null : prev)
    this.next = (next===undefined ? null : next)
}
```

Python

```python
# Represents an entry in the hash table
class Record:
    def __init__(self, key: int, value: int):
        self.key = key
        self.value = value

# Definition for doubly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None
```

***

# Implementing the hash table class

Now that we know the individual components of a hash table and how its operations are implemented using separate chaining, let us look at the hash table class. This class encapsulates all these components and provides public functions to expose these operations. The hash table class abstracts away the implementation details of operations and the internal data structures to provide a clean and simple-to-use interface.

// Diagram: Representation of separate chaining implementation of a hash table encapsulated in a class

## Implementation

The hash table class is implemented by encapsulating all the components we learned earlier with the search, insert, and delete operations as public functions. The hash function and other helper functions and definitions are private to the class and need not be exposed.

C++

```cpp
#include <list>

// Diagram: using namespace std;

// Represents an entry in the hash table
struct Record {
    int key;
    int value;

    Record() = default;
    Record(int key, int value) : key(key), value(value) {}
};

class MyHashTable {
private:

    // The hashtable
    vector<list<Record>> table;
    int capacity;

public:
    MyHashTable(int capacity) : capacity(capacity), table(capacity) {}

// Diagram: int search(int key) {}

// Diagram: void insert(int key, int value) {}

    void remove(int key) {}
};
```

Java

```java
import java.util.*;

// Represents an entry in the hash table
class Record {
    int key;
    int value;

    Record(int key, int value) {
        this.key = key;
        this.value = value;
    }

// Diagram: class MyHashTable {

    // The hashtable
    private List<LinkedList<Record>> table;
    private int capacity;

    public MyHashTable(int capacity) {
        this.capacity = capacity;

        // Initialize the table with the given capacity
        table = new ArrayList<>(capacity);
        for (int i = 0; i < capacity; i++) {
            table.add(new LinkedList<>());
        }

// Diagram: public int search(int key) {}

// Diagram: public void insert(int key, int value) {}

    public void remove(int key) {}
}
```

Typescript

```typescript
import { DoublyLinkedList } from "datastructures-js";

// Represents an entry in the hash table
class Record {
    key: number;
    value: number;

    constructor(key: number, value: number) {
        this.key = key;
        this.value = value;
    }

// Diagram: export class MyHashTable {

    // The hashtable
    table: DoublyLinkedList<Record>[];
    capacity: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Initialize the table with the given capacity
        this.table = Array.from(
            { length: capacity },
            () => new DoublyLinkedList<Record>()
        );
    }

// Diagram: search(key: number): number {}

// Diagram: insert(key: number, value: number): void {}

    remove(key: number): void {}
}
```

Javascript

```javascript
import { DoublyLinkedList } from "datastructures-js";

// Represents an entry in the hash table
class Record {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

// Diagram: export class MyHashTable {

    // The hashtable
    constructor(capacity) {
        this.capacity = capacity;

        // Initialize the table with the given capacity
        this.table = Array.from(
            { length: capacity },
            () => new DoublyLinkedList()
        );
    }

// Diagram: search(key) {}

// Diagram: insert(key, value) {}

    remove(key) {}
}
```

Python

```python
from typing import List
from llist import dllist

# Represents an entry in the hash table
class Record:
    def __init__(self, key: int, value: int):
        self.key = key
        self.value = value

class MyHashTable:
    def __init__(self, capacity: int):
        self.capacity = capacity

        # Initialize the table with the given capacity
        self.table = [dllist() for _ in range(capacity)]

    def search(self, key: int) -> int:
        pass

    def insert(self, key: int, value: int) -> None:
        pass

    def remove(self, key: int) -> None:
        pass
```

## Using the hash table class

The hash table class abstracts away the implementation details in a class. Anyone who wants to use the hash table as a data structure can instantiate an object of the hash table class we defined earlier and operate upon it by calling the exposed public functions. The caller does not need to care about the implementation detail and can focus on solving the higher-level problem.

C++

```cpp
#include <list>

// Diagram: using namespace std;

// Represents an entry in the hash table
struct Record {
    int key;
    int value;

    Record() = default;
    Record(int key, int value) : key(key), value(value) {}
};

class MyHashTable {
private:

    // The hashtable
    vector<list<Record>> table;
    int capacity;

public:
    MyHashTable(int capacity) : capacity(capacity), table(capacity) {}

// Diagram: int search(int key) {}

// Diagram: void insert(int key, int value) {}

    void remove(int key) {}
};
```

Java

```java
import java.util.*;

// Represents an entry in the hash table
class Record {
    int key;
    int value;

    Record(int key, int value) {
        this.key = key;
        this.value = value;
    }

// Diagram: class MyHashTable {

    // The hashtable
    private List<LinkedList<Record>> table;
    private int capacity;

    public MyHashTable(int capacity) {
        this.capacity = capacity;

        // Initialize the table with the given capacity
        table = new ArrayList<>(capacity);
        for (int i = 0; i < capacity; i++) {
            table.add(new LinkedList<>());
        }

// Diagram: public int search(int key) {}

// Diagram: public void insert(int key, int value) {}

    public void remove(int key) {}
}
```

Typescript

```typescript
import { DoublyLinkedList } from "datastructures-js";

// Represents an entry in the hash table
class Record {
    key: number;
    value: number;

    constructor(key: number, value: number) {
        this.key = key;
        this.value = value;
    }

// Diagram: export class MyHashTable {

    // The hashtable
    table: DoublyLinkedList<Record>[];
    capacity: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Initialize the table with the given capacity
        this.table = Array.from(
            { length: capacity },
            () => new DoublyLinkedList<Record>()
        );
    }

// Diagram: search(key: number): number {}

// Diagram: insert(key: number, value: number): void {}

    remove(key: number): void {}
}
```

Javascript

```javascript
import { DoublyLinkedList } from "datastructures-js";

// Represents an entry in the hash table
class Record {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

// Diagram: export class MyHashTable {

    // The hashtable
    constructor(capacity) {
        this.capacity = capacity;

        // Initialize the table with the given capacity
        this.table = Array.from(
            { length: capacity },
            () => new DoublyLinkedList()
        );
    }

// Diagram: search(key) {}

// Diagram: insert(key, value) {}

    remove(key) {}
}
```

Python

```python
from typing import List
from llist import dllist

# Represents an entry in the hash table
class Record:
    def __init__(self, key: int, value: int):
        self.key = key
        self.value = value

class MyHashTable:
    def __init__(self, capacity: int):
        self.capacity = capacity

        # Initialize the table with the given capacity
        self.table = [dllist() for _ in range(capacity)]

    def search(self, key: int) -> int:
        pass

    def insert(self, key: int, value: int) -> None:
        pass

    def remove(self, key: int) -> None:
        pass
```

To better understand how encapsulating all the data and operations to implement a hash table is useful, let us look at what happens when the code above is executed.

// Diagram: Execution of code using an instance (object) of the hash table class

Now that we know what the separate chaining implementation of a hash table using a linked list looks like and how it functions, we will learn more about the implementation of each operation in the coming lessons.

***

# Search operation in separate chaining

The search operation is one of the primary operations on a hash table and is used to retrieve the value of a key as stored in the hash table. The implementation is encapsulated in the search function and relies on the separate chaining collision resolution scheme to look for a value in the internal array of linked lists. Let us look at the algorithm and implementation of the search operation in a hash table implemented using separate chaining.

## Algorithm

The search operation is quite simple. We only need to calculate the index (hash code) for the given key and then search for the key at the index. However, the hash table could have a collision for the given key (another key with the same hash code stored in the table), so we must follow a separate chaining scheme to search for the given key.

Once we calculate the index (hash code) for the given key, we start a linear search in the linked list at that index until we either find the key or the linked list is traversed completely. If the given key is found in the table, we return it. Otherwise, we return a flag (`-1` in this example) to indicate that the key is absent.

// Diagram: Search for the given key in a separate chaining implementation of a hash table using linked list

> **Algorithm**
>
> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Search for the key in the list at the calculated index.
> -   **Step 3:** If the key is found, return it's value. Otherwise, return \`-1\`.

## Implementation

To implement the operation, we use the hash function to get the index in the internal array and then traverse the linked list at that index to search for the given key. If the key is found, we return its value. Otherwise, we return -1.

C++

```cpp
#include <list>

// Diagram: using namespace std;

// Represents an entry in the hash table
struct Record {
    int key;
    int value;

    Record() = default;
    Record(int key, int value) : key(key), value(value) {}
};

class MyHashTable {
private:

    // The hashtable
    vector<list<Record>> table;
    int capacity;

// Diagram: int hashFunction(int key) { return key % capacity; }

public:
    MyHashTable(int capacity) : capacity(capacity), table(capacity) {}

// Diagram: int search(int key) {

        // Get the bucket index
        int index = hashFunction(key);

        // Search for the key in the bucket
        for (auto &entry : table[index]) {
            if (entry.key == key) {

                // Return the value if key is found
                return entry.value;
            }

        // Return -1 if the key is not found
        return -1;
    }
};
```

Java

```java
import java.util.*;

// Represents an entry in the hash table
class Record {
    int key;
    int value;

    Record(int key, int value) {
        this.key = key;
        this.value = value;
    }

// Diagram: class MyHashTable {

    // The hashtable
    private List<LinkedList<Record>> table;
    private int capacity;

    public MyHashTable(int capacity) {
        this.capacity = capacity;

        // Initialize the table with the given capacity
        table = new ArrayList<>(capacity);
        for (int i = 0; i < capacity; i++) {
            table.add(new LinkedList<>());
        }

    private int hashFunction(int key) {
        return key % capacity;
    }

// Diagram: public int search(int key) {

        // Get the bucket index
        int index = hashFunction(key);

        // Search for the key in the bucket
        for (Record entry : table.get(index)) {
            if (entry.key == key) {

                // Return the value if key is found
                return entry.value;
            }

        // Return -1 if the key is not found
        return -1;
    }
```

Typescript

```typescript
import { DoublyLinkedList } from "datastructures-js";

// Represents an entry in the hash table
class Record {
    key: number;
    value: number;

    constructor(key: number, value: number) {
        this.key = key;
        this.value = value;
    }

// Diagram: export class MyHashTable {

    // The hashtable
    table: DoublyLinkedList<Record>[];
    capacity: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Initialize the table with the given capacity
        this.table = Array.from(
            { length: capacity },
            () => new DoublyLinkedList<Record>()
        );
    }

    hashFunction(key: number): number {
        return key % this.capacity;
    }

// Diagram: search(key: number): number {

        // Get the bucket index
        const index = this.hashFunction(key);

        // Search for the key in the bucket
        let head = this.table[index].head();
        while (head !== null) {
            if (head.getValue().key === key) {

                // Return the value if key is found
                return head.getValue().value;
            }
            head = head.getNext();
        }

        // Return -1 if the key is not found
        return -1;
    }
```

Javascript

```javascript
import { DoublyLinkedList } from "datastructures-js";

// Represents an entry in the hash table
class Record {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

// Diagram: export class MyHashTable {

    // The hashtable
    constructor(capacity) {
        this.capacity = capacity;

        // Initialize the table with the given capacity
        this.table = Array.from(
            { length: capacity },
            () => new DoublyLinkedList()
        );
    }

    hashFunction(key) {
        return key % this.capacity;
    }

// Diagram: search(key) {

        // Get the bucket index
        const index = this.hashFunction(key);

        // Search for the key in the bucket
        let head = this.table[index].head();
        while (head !== null) {
            if (head.getValue().key === key) {

                // Return the value if key is found
                return head.getValue().value;
            }
            head = head.getNext();
        }

        // Return -1 if the key is not found
        return -1;
    }
```

Python

```python
from typing import List
from llist import dllist

# Represents an entry in the hash table
class Record:
    def __init__(self, key: int, value: int):
        self.key = key
        self.value = value

class MyHashTable:
    def __init__(self, capacity: int):
        self.capacity = capacity

        # Initialize the table with the given capacity
        self.table = [dllist() for _ in range(capacity)]

    def hash_function(self, key: int) -> int:
        return key % self.capacity

    def search(self, key: int) -> int:

        # Get the bucket index
        index = self.hash_function(key)

        # Search for the key in the bucket
        head = self.table[index].first
        while head:
            if head.value.key == key:

                # Return the value if key is found
                return head.value.value
            head = head.next

        # Return -1 if the key is not found
        return -1
```

## Complexity analysis

The search operation computes the hash value of the provided key, which is a constant-time operation. However, after that, we have to traverse the linked list at the calculated index to search for the key. In the best case, the linked list at that index may only have one node, so the time complexity will be **constant**, **O(1)**.

In the worst case, however, all the keys stored in the hash table may have collided at the same hash value (index), so the size of the linked list would be the size of all key-value pairs stored (N). Thus, the worst-case time complexity of the search operation is **linear** **O(N)**.

// Diagram: Best case, average case and worst case depends on the size of linked list at the calculated index

Since we do not create any new data structure that depends on the size of stored data or input and only create a fixed number of temporary variables to implement the operation, the space complexity is **constant** **O(1)** in any case.

> **Best Case** - No collision
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Average Case** - Evenly distributed hash values
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case** - 100% collision
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Insert operation in separate chaining

The insert operation is another primary operation on a hash table and is used to insert a key-value mapping(Record) into the hash table. If the key is already in the hash table, the insert operation updates its value to the new value supplied. The implementation is encapsulated in the insert function, which uses separate chaining to search for the key first. Let us look at the algorithm and implementation of the insert operation in a hash table implemented using separate chaining.

## Algorithm

The insert operation is just an extension of the search operation. Like the search operation, we calculate the index (hash code) for the given key and search the linked list at that index for a record with the given key. We need to consider two cases.

### 1\. Key is present in the table

If a record with the given key is found in the linked list at the calculated index with the given key, its value is updated to the new value. 

// Diagram: Insert a key value pair in the hash table where the key is present

> **Algorithm**
>
> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Search for the key in the list at the calculated index.
> -   **Step 3:** If the key is found, update the value of the stored record.

### 1\. Key is not present in the table

If no record with the given key is found in the linked list at the calculated index. A new record with the given key-value pair is created and inserted at the **end** of the linked list.

**Why do we insert the node at the end?**

Since the key was not found during the search, we have already reached the end of the list. Thus, we can simply insert the new node there.

// Diagram: Insert a key value pair in the hash table where the key is not present

> **Algorithm**
>
> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Search for the key in the list at the calculated index.
> -   **Step 3:** If the key is not found, add a new node with the key-value pair at the end of the list.

## Implementation

We use the hash function to get the index in the internal array and update the node with a given key if it exists. Otherwise, we create a record object with the given key and value and add it to the front of the linked list at the calculated index.

C++

```cpp
#include <list>

// Diagram: using namespace std;

// Represents an entry in the hash table
struct Record {
    int key;
    int value;

    Record() = default;
    Record(int key, int value) : key(key), value(value) {}
};

class MyHashTable {
private:

    // The hashtable
    vector<list<Record>> table;
    int capacity;

// Diagram: int hashFunction(int key) { return key % capacity; }

public:
    MyHashTable(int capacity) : capacity(capacity), table(capacity) {}

// Diagram: int search(int key) {

        // Get the bucket index
        int index = hashFunction(key);

        // Search for the key in the bucket
        for (auto &entry : table[index]) {
            if (entry.key == key) {

                // Return the value if key is found
                return entry.value;
            }

        // Return -1 if the key is not found
        return -1;
    }

// Diagram: void insert(int key, int value) {

        // Get the bucket index
        int index = hashFunction(key);

        // Check if the key already exists and update its value
        for (auto &entry : table[index]) {
            if (entry.key == key) {

                // Update value if key exists
                entry.value = value;
                return;
            }

        // Add a new record if the key does not exist
        table[index].emplace_back(key, value);
    }
};
```

Java

```java
import java.util.*;

// Represents an entry in the hash table
class Record {
    int key;
    int value;

    Record(int key, int value) {
        this.key = key;
        this.value = value;
    }

// Diagram: class MyHashTable {

    // The hashtable
    private List<LinkedList<Record>> table;
    private int capacity;

    public MyHashTable(int capacity) {
        this.capacity = capacity;

        // Initialize the table with the given capacity
        table = new ArrayList<>(capacity);
        for (int i = 0; i < capacity; i++) {
            table.add(new LinkedList<>());
        }

    private int hashFunction(int key) {
        return key % capacity;
    }

// Diagram: public int search(int key) {

        // Get the bucket index
        int index = hashFunction(key);

        // Search for the key in the bucket
        for (Record entry : table.get(index)) {
            if (entry.key == key) {

                // Return the value if key is found
                return entry.value;
            }

        // Return -1 if the key is not found
        return -1;
    }

// Diagram: public void insert(int key, int value) {

        // Get the bucket index
        int index = hashFunction(key);

        // Check if the key already exists and update its value
        for (Record entry : table.get(index)) {
            if (entry.key == key) {

                // Update value if key exists
                entry.value = value;
                return;
            }

        // Add a new record if the key does not exist
        table.get(index).add(new Record(key, value));
    }
```

Typescript

```typescript
import { DoublyLinkedList } from "datastructures-js";

// Represents an entry in the hash table
class Record {
    key: number;
    value: number;

    constructor(key: number, value: number) {
        this.key = key;
        this.value = value;
    }

// Diagram: export class MyHashTable {

    // The hashtable
    table: DoublyLinkedList<Record>[];
    capacity: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Initialize the table with the given capacity
        this.table = Array.from(
            { length: capacity },
            () => new DoublyLinkedList<Record>()
        );
    }

    hashFunction(key: number): number {
        return key % this.capacity;
    }

// Diagram: search(key: number): number {

        // Get the bucket index
        const index = this.hashFunction(key);

        // Search for the key in the bucket
        let head = this.table[index].head();
        while (head !== null) {
            if (head.getValue().key === key) {

                // Return the value if key is found
                return head.getValue().value;
            }
            head = head.getNext();
        }

        // Return -1 if the key is not found
        return -1;
    }

// Diagram: insert(key: number, value: number): void {

        // Get the bucket index
        const index = this.hashFunction(key);

        // Check if the key already exists and update its value
        let head = this.table[index].head();
        while (head !== null) {
            if (head.getValue().key === key) {

                // Update value if key exists
                head.setValue(new Record(key, value));
                return;
            }

            head = head.getNext();
        }

        // Add a new record if the key does not exist
        this.table[index].insertLast(new Record(key, value));
    }
```

Javascript

```javascript
import { DoublyLinkedList } from "datastructures-js";

// Represents an entry in the hash table
class Record {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

// Diagram: export class MyHashTable {

    // The hashtable
    constructor(capacity) {
        this.capacity = capacity;

        // Initialize the table with the given capacity
        this.table = Array.from(
            { length: capacity },
            () => new DoublyLinkedList()
        );
    }

    hashFunction(key) {
        return key % this.capacity;
    }

// Diagram: search(key) {

        // Get the bucket index
        const index = this.hashFunction(key);

        // Search for the key in the bucket
        let head = this.table[index].head();
        while (head !== null) {
            if (head.getValue().key === key) {

                // Return the value if key is found
                return head.getValue().value;
            }
            head = head.getNext();
        }

        // Return -1 if the key is not found
        return -1;
    }

// Diagram: insert(key, value) {

        // Get the bucket index
        const index = this.hashFunction(key);

        // Check if the key already exists and update its value
        let head = this.table[index].head();
        while (head !== null) {
            if (head.getValue().key === key) {

                // Update value if key exists
                head.setValue(new Record(key, value));
                return;
            }

            head = head.getNext();
        }

        // Add a new record if the key does not exist
        this.table[index].insertLast(new Record(key, value));
    }
```

Python

```python
from typing import List
from llist import dllist

# Represents an entry in the hash table
class Record:
    def __init__(self, key: int, value: int):
        self.key = key
        self.value = value

class MyHashTable:
    def __init__(self, capacity: int):
        self.capacity = capacity

        # Initialize the table with the given capacity
        self.table = [dllist() for _ in range(capacity)]

    def hash_function(self, key: int) -> int:
        return key % self.capacity

    def search(self, key: int) -> int:

        # Get the bucket index
        index = self.hash_function(key)

        # Search for the key in the bucket
        head = self.table[index].first
        while head:
            if head.value.key == key:

                # Return the value if key is found
                return head.value.value
            head = head.next

        # Return -1 if the key is not found
        return -1

    def insert(self, key: int, value: int) -> None:

        # Get the bucket index
        index = self.hash_function(key)

        # Check if the key already exists and update its value
        head = self.table[index].first
        while head:
            if head.value.key == key:

                # Update value if key exists
                head.value.value = value
                return
            head = head.next

        # Add a new record if the key does not exist
        self.table[index].append(Record(key, value))
```

## Complexity analysis

The insert operation computes the hash value of the provided key, which is a constant-time operation. However, after that, we have to traverse the linked list at the calculated index to search for the key first. In the best case, the linked list at that index might be empty, so the time complexity will be **constant**, **O(1)**.

In the worst case, however, all the keys stored in the hash table may have collided at the same hash value (index), so the size of the linked list would be the size of all key-value pairs stored (N). If the key is not in the hash table, we would have to traverse this entire list to confirm that before creating and adding a new record. And so, the worst-case time complexity of the insert operation is **linear** **O(N)**.

// Diagram: Best case, average case and worst case depends on the size of linked list at the calculated index

To insert a new key-value pair, we create only a single new node and insert it at the front of the linked list. We do not create any new data structure that depends on the size of stored data or input. We only create a fixed number of temporary variables to implement the operation, so the space complexity is **constant** **O(1)**.

> **Best Case** - No collision or calculated index empty
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Average Case** - Evenly distributed hash values
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case** - 100% collision and key not present
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Delete operation in separate chaining

The delete operation is another primary operation on a hash table and is used to delete a key-value mapping(Record) from the hash table. If the key is not in the hash table, it is a no-op(nothing is done). The implementation is encapsulated in the delete function, which uses separate chaining to search for the key first. Let us look at the algorithm and implementation of the delete operation in a hash table implemented using separate chaining.

## Algorithm

The delete operation is also an extension of the search operation. Like the search operation, we calculate the index (hash code) for the given key and search the linked list at that index for a record with the given key. We need to consider two cases.

### 1\. Key is present in the table

If a record is found in the linked list at the calculated index that has the given key, the node where it is stored is deleted from the linked list using the standard node deletion algorithm in a linked list. The resultant list is then stored at the calculated index.

// Diagram: Delete a key from the hash table where the key is present

> **Algorithm**
>
> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Search for the key in the list at the calculated index.
> -   **Step 3:** Delete the node if it is found and store the resultant list at the calculated index.

### 2\. Key is not present in the table

Nothing is done if no record is found in the linked list at the calculated index with the given key, and the delete operation becomes a no-op (nothing done).

// Diagram: Delete a key from the hash table where the key is not present

## Implementation

To implement the operation we use the hash function to get the index in the internal array and then traverse the linked list at that index to search for the given key. If the key is found, we delete that node from the linked list at the calculated index. 

C++

```cpp
#include <list>

// Diagram: using namespace std;

// Represents an entry in the hash table
struct Record {
    int key;
    int value;

    Record() = default;
    Record(int key, int value) : key(key), value(value) {}
};

class MyHashTable {
private:

    // The hashtable
    vector<list<Record>> table;
    int capacity;

// Diagram: int hashFunction(int key) { return key % capacity; }

public:
    MyHashTable(int capacity) : capacity(capacity), table(capacity) {}

// Diagram: int search(int key) {

        // Get the bucket index
        int index = hashFunction(key);

        // Search for the key in the bucket
        for (auto &entry : table[index]) {
            if (entry.key == key) {

                // Return the value if key is found
                return entry.value;
            }

        // Return -1 if the key is not found
        return -1;
    }

// Diagram: void insert(int key, int value) {

        // Get the bucket index
        int index = hashFunction(key);

        // Check if the key already exists and update its value
        for (auto &entry : table[index]) {
            if (entry.key == key) {

                // Update value if key exists
                entry.value = value;
                return;
            }

        // Add a new record if the key does not exist
        table[index].emplace_back(key, value);
    }

// Diagram: void remove(int key) {

        // Get the bucket index
        int index = hashFunction(key);

        // Remove the record with the matching key
        for (auto it = table[index].begin(); it != table[index].end();
             ++it) {
            if (it->key == key) {

                // Remove the record
                table[index].erase(it);
                return;
            }
};
```

Java

```java
import java.util.*;

// Represents an entry in the hash table
class Record {
    int key;
    int value;

    Record(int key, int value) {
        this.key = key;
        this.value = value;
    }

// Diagram: class MyHashTable {

    // The hashtable
    private List<LinkedList<Record>> table;
    private int capacity;

    public MyHashTable(int capacity) {
        this.capacity = capacity;

        // Initialize the table with the given capacity
        table = new ArrayList<>(capacity);
        for (int i = 0; i < capacity; i++) {
            table.add(new LinkedList<>());
        }

    private int hashFunction(int key) {
        return key % capacity;
    }

// Diagram: public int search(int key) {

        // Get the bucket index
        int index = hashFunction(key);

        // Search for the key in the bucket
        for (Record entry : table.get(index)) {
            if (entry.key == key) {

                // Return the value if key is found
                return entry.value;
            }

        // Return -1 if the key is not found
        return -1;
    }

// Diagram: public void insert(int key, int value) {

        // Get the bucket index
        int index = hashFunction(key);

        // Check if the key already exists and update its value
        for (Record entry : table.get(index)) {
            if (entry.key == key) {

                // Update value if key exists
                entry.value = value;
                return;
            }

        // Add a new record if the key does not exist
        table.get(index).add(new Record(key, value));
    }

// Diagram: public void remove(int key) {

        // Get the bucket index
        int index = hashFunction(key);

        // Remove the record with the matching key
        table.get(index).removeIf(entry -> entry.key == key);
    }
```

Typescript

```typescript
import { DoublyLinkedList } from "datastructures-js";

// Represents an entry in the hash table
class Record {
    key: number;
    value: number;

    constructor(key: number, value: number) {
        this.key = key;
        this.value = value;
    }

// Diagram: export class MyHashTable {

    // The hashtable
    table: DoublyLinkedList<Record>[];
    capacity: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Initialize the table with the given capacity
        this.table = Array.from(
            { length: capacity },
            () => new DoublyLinkedList<Record>()
        );
    }

    hashFunction(key: number): number {
        return key % this.capacity;
    }

// Diagram: search(key: number): number {

        // Get the bucket index
        const index = this.hashFunction(key);

        // Search for the key in the bucket
        let head = this.table[index].head();
        while (head !== null) {
            if (head.getValue().key === key) {

                // Return the value if key is found
                return head.getValue().value;
            }
            head = head.getNext();
        }

        // Return -1 if the key is not found
        return -1;
    }

// Diagram: insert(key: number, value: number): void {

        // Get the bucket index
        const index = this.hashFunction(key);

        // Check if the key already exists and update its value
        let head = this.table[index].head();
        while (head !== null) {
            if (head.getValue().key === key) {

                // Update value if key exists
                head.setValue(new Record(key, value));
                return;
            }

            head = head.getNext();
        }

        // Add a new record if the key does not exist
        this.table[index].insertLast(new Record(key, value));
    }

// Diagram: remove(key: number): void {

        // Get the bucket index
        const index = this.hashFunction(key);

        // Remove the record with the matching key
        let head = this.table[index].head();
        while (head !== null) {
            if (head.getValue().key === key) {

                // Remove the record
                this.table[index].remove(head);
                return;
            }

            head = head.getNext();
        }
```

Javascript

```javascript
import { DoublyLinkedList } from "datastructures-js";

// Represents an entry in the hash table
class Record {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

// Diagram: export class MyHashTable {

    // The hashtable
    constructor(capacity) {
        this.capacity = capacity;

        // Initialize the table with the given capacity
        this.table = Array.from(
            { length: capacity },
            () => new DoublyLinkedList()
        );
    }

    hashFunction(key) {
        return key % this.capacity;
    }

// Diagram: search(key) {

        // Get the bucket index
        const index = this.hashFunction(key);

        // Search for the key in the bucket
        let head = this.table[index].head();
        while (head !== null) {
            if (head.getValue().key === key) {

                // Return the value if key is found
                return head.getValue().value;
            }
            head = head.getNext();
        }

        // Return -1 if the key is not found
        return -1;
    }

// Diagram: insert(key, value) {

        // Get the bucket index
        const index = this.hashFunction(key);

        // Check if the key already exists and update its value
        let head = this.table[index].head();
        while (head !== null) {
            if (head.getValue().key === key) {

                // Update value if key exists
                head.setValue(new Record(key, value));
                return;
            }

            head = head.getNext();
        }

        // Add a new record if the key does not exist
        this.table[index].insertLast(new Record(key, value));
    }

// Diagram: remove(key) {

        // Get the bucket index
        const index = this.hashFunction(key);

        // Remove the record with the matching key
        let head = this.table[index].head();
        while (head !== null) {
            if (head.getValue().key === key) {

                // Remove the record
                this.table[index].remove(head);
                return;
            }

            head = head.getNext();
        }
```

Python

```python
from typing import List
from llist import dllist

# Represents an entry in the hash table
class Record:
    def __init__(self, key: int, value: int):
        self.key = key
        self.value = value

class MyHashTable:
    def __init__(self, capacity: int):
        self.capacity = capacity

        # Initialize the table with the given capacity
        self.table = [dllist() for _ in range(capacity)]

    def hash_function(self, key: int) -> int:
        return key % self.capacity

    def search(self, key: int) -> int:

        # Get the bucket index
        index = self.hash_function(key)

        # Search for the key in the bucket
        head = self.table[index].first
        while head:
            if head.value.key == key:

                # Return the value if key is found
                return head.value.value
            head = head.next

        # Return -1 if the key is not found
        return -1

    def insert(self, key: int, value: int) -> None:

        # Get the bucket index
        index = self.hash_function(key)

        # Check if the key already exists and update its value
        head = self.table[index].first
        while head:
            if head.value.key == key:

                # Update value if key exists
                head.value.value = value
                return
            head = head.next

        # Add a new record if the key does not exist
        self.table[index].append(Record(key, value))

    def remove(self, key: int) -> None:

        # Get the bucket index
        index = self.hash_function(key)

        # Remove the record with the matching key
        head = self.table[index].first
        while head:
            if head.value.key == key:

                # Remove the record
                self.table[index].remove(head)
                return
            head = head.next
```

## Complexity analysis

The delete operation computes the hash value of the provided key, which is a constant-time operation. However, after that, we have to traverse the linked list at the calculated index to search for the key first. In the best case, the linked list at that index might be empty, so the time complexity will be **constant**, **O(1)**.

In the worst case, however, all the keys stored in the hash table may have collided at the same hash value (index), so the size of the linked list would be the size of all key-value pairs stored (N). If the key is not in the hash table, we must traverse this list to confirm that. And so, the worst-case time complexity of the delete operation is **linear** **O(N)**.

// Diagram: Best case, average case and worst case depends on the size of linked list at the calculated index

To delete the given key, we do not create any new data structure that depends on the size of stored data or input. We only create a fixed number of temporary variables to implement the operation. Thus, the space complexity is **constant O(1)**.

> **Best Case** - No collision or calculated index empty
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Average Case** - Evenly distributed hash values
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case** - 100% collision and key not present
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Design a hash table with separate chaining

## Problem Statement

Given the skeleton of a **MyHashTable** class, complete this class by implementing all the operations below.

> -   **MyHashTable(int capacity)** - Initializes the hash table object with the given capacity for the internal data structure.
> -   **search(int key)** - Returns the value mapped to the given key, or \`-1\` if the key is absent.
> -   **insert(int key, int value)** - Inserts a (key, value) pair into the hash table. If the key already exists, it updates the value. Returns \`true\` if the operation is successful; otherwise, returns \`false\`.
> -   **remove(int key)** - Removes the key and its corresponding value if the mapping for the key exists in the key.
> -   **getKeysAtIndex(int index)** - Returns the list of keys mapped to the given index in the internal data structure.

// Diagram: You must abide by the following constraints

// Diagram: 1\. You must implement this without using any built-in hash table libraries

// Diagram: 2. Separate chaining must be used as a collision resolution strategy

3\. The hash function should compute a key's index by taking the key's modulo with the hash table's capacity, i.e., `index = key % capacity`.

> The input should adhere to the following rules:
>
> 1.  The input should contain two arrays of the same size.
> 2.  The first array should contain the list of operations, while the second should contain the corresponding operands for those operations.
> 3.  The first index in the first array should contain **MyHashTable**, and the first index in the second array should contain a single positive integer representing the capacity of the hash table. This value is used to initialise the hash table.
> 4.  For each index in the first array that contains the **insert** operation, the corresponding index in the second array should contain a (key, value) pair to be inserted.
> 5.  For each index in the first array that contains **search** or **remove** operations, the corresponding index in the second array should contain the key for which that operation will be performed.
> 6.  For each index in the first array that contains the **getKeysAtIndex** operation, the corresponding index in the second array should contain the index for which the operation will be performed.
>
> **Example:**
>
> -   **Input:** \[MyHashTable, insert, insert, search, insert, search, insert, search, search, getKeysAtIndex\] \[\[1\], \[1, 2\], \[2, 4\], \[1\], \[1, 3\], \[1\], \[2, 5\], \[2\], \[3\], \[0\]\]
>
> -   **Output:** \[null, true, true, 2, true, 3, true, 5, -1, \[1, 2\]\]
>
> **Explanation:**
>
> **Operation:** MyHashTable myHashTable = new MyHashTable(1) **Result:** Initializes an empty \`MyHashTable\` with a capacity of 1
>
> **Operation:** myHashTable.insert(1, 2) **Result:** \`table = \[\[\[1, 2\]\]\]\`, returns \`true\`
>
> **Operation:** myHashTable.insert(2, 4) **Result:** \`table = \[\[\[1, 2\], \[2, 4\]\]\]\`, returns \`true\`
>
> **Operation:** myHashTable.search(1) **Result:** Returns \`2\`
>
> **Operation:** myHashTable.insert(1, 3) **Result:** \`table = \[\[\[1, 3\], \[2, 4\]\]\]\`, returns \`true\`
>
> **Operation:** myHashTable.search(1) **Result:** Returns \`3\`
>
> **Operation:** myHashTable.insert(2, 5) **Result:** \`table = \[\[\[1, 3\], \[2, 5\]\]\]\`, returns \`true\`
>
> **Operation:** myHashTable.search(2) **Result:** Returns \`5\`
>
> **Operation:** myHashTable.search(3) **Result:** Returns \`-1\`
>
> **Operation:** myHashTable.getKeysAtIndex(0) **Result:** At index 0 of the hash table, we have two keys, 1 and 2, so returns \`\[1, 2\]\`

## Solution

```cpp
#include <list>

using namespace std;

// Represents an entry in the hash table
struct Record {
    int key;
    int value;

    Record() = default;
    Record(int key, int value) : key(key), value(value) {}
};

class MyHashTable {
private:

    int capacity;

    // The hashtable
    vector<list<Record>> table;

    int hashFunction(int key) { return key % capacity; }

public:
    MyHashTable(int capacity) : capacity(capacity), table(capacity) {

    }

    int search(int key) {

        // Get the bucket index
        int index = hashFunction(key);

        // Search for the key in the bucket
        for (auto &entry : table[index]) {
            if (entry.key == key) {

                // Return the value if key is found
                return entry.value;
            }
        }

        // Return -1 if the key is not found
        return -1;
    }

    void insert(int key, int value) {

        // Get the bucket index
        int index = hashFunction(key);

        // Check if the key already exists and update its value
        for (auto &entry : table[index]) {
            if (entry.key == key) {

                // Update value if key exists
                entry.value = value;
                return;
            }
        }

        // Add a new record if the key does not exist
        table[index].emplace_back(key, value);
    }

    void remove(int key) {

        // Get the bucket index
        int index = hashFunction(key);

        // Remove the record with the matching key
        for (auto it = table[index].begin(); it != table[index].end();
             ++it) {
            if (it->key == key) {

                // Remove the record
                table[index].erase(it);
                return;
            }
        }
    }

    vector<int> getKeysAtIndex(int index) {

        // Return an empty vector if the index is invalid
        if (index < 0 || index >= capacity) {
            return {};
        }

        // Collect all keys in the bucket
        vector<int> keys;
        for (auto &entry : table[index]) {
            keys.push_back(entry.key);
        }

        return keys;
    }
};
```
