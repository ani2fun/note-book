# 4. Quadratic probing

## Table of contents

1. [Introduction to quadratic probing](#introduction-to-quadratic-probing)
2. [Key components of quadratic probing](#key-components-of-quadratic-probing)
3. [Implementing the hash table class](#implementing-the-hash-table-class)
4. [Search operation in quadratic probing](#search-operation-in-quadratic-probing)
5. [Insert operation in quadratic probing](#insert-operation-in-quadratic-probing)
6. [Delete operation in quadratic probing](#delete-operation-in-quadratic-probing)
7. [Design a hash table with quadratic probing](#design-a-hash-table-with-quadratic-probing)

***

# Introduction to quadratic probing

Now that we know how a hash table is implemented using linear probing and some of its limitations, we look at another popular open-addressing collision resolution scheme called quadratic probing. It is a slight variation over linear probing with all its advantages but reduces the primary clustering problem by modifying the probe sequence.

Like linear probing, the internal array stores the key-value pair in a quadratic probing scheme. The size of the internal array limits the size of the hash table, and because the array has contiguous memory, it has performance benefits due to the locality of reference.

// Diagram: Logical representation of the internal array storing the key value mappings and empty slots

The internal array can also be a dynamic array that can be resized when the hash table is full. In this course, however, we will only learn about implementation using a fixed-sized array to keep things simple.

## Handling collisions

Unlike linear probing, in quadratic probing, when two keys have the same hash value (index), they are stored non-consecutively in the array. The distance between each collision increases exponentially and is determined by a quadratic function. It calculates the index for the ith collision for any hashed value. Let us look at an example of a simple quadratic function to understand collision resolution better.

// Diagram: The probe sequence is calculated using a quadratic function

Like linear probing, the first colliding key is stored at the correct hash index, while all other colliding keys are stored at indices in the array representing some other hash value. Unlike linear probing, though, since the colliding values are separated by exponentially increasing distances, primary clustering is avoided. Continuing the example quadratic function from above, let us look at the indices where the colliding keys will be stored in the internal array.

// Diagram: Colliding keys are stored at exponentially increasing distances in the internal array

Like linear probing, the quadratic probing search is generally performed up to N iterations, where N is the size of the array. A modulo operator makes the traversal circular to keep the result within the array's bounds. The collision resolution scheme can be summarized as follows:

> **Insert**
>
> -   **Step 1:** Find the hash value for the given key
> -   **Step 2:** Iterate up to N times using the quadratic function to calculate the index until an unoccupied slot is found.
> -   **Step 3:** For each iteration, calculate the index using a quadratic equation and iterate until an unoccupied slot is found
> -   **Step 4:** Insert the key-value pair at the slot.
>
> **Search**
>
> -   **Step 1:** Find the hash value for the given key
> -   **Step 2:** Iterate up to N times using the quadratic function to calculate the index until the key or an unoccupied slot is found.
> -   **Step 3:** Return the value if the key is found

The quadratic probing implementation is quite simple, as it is just a slight variation of linear probing. Later in the course, we will look at the components of a hash table implemented using quadratic probing.

***

# Key components of quadratic probing

Now that we know quadratic probing, let us look at the structure of a hash table implemented using it. The hash table is just an encapsulation around an array that stores key-value pairs. Different pieces have to be put together to create a hash table. Let us look at all the components and functions needed to implement a hash table using quadratic probing.

## Record

Like linear probing, in a quadratic probing implementation of a hash table, each index in the internal array stores only one record, and collisions are handled by finding the next available free slot using quadratic probing. For this reason, at each index in the array, we store the key-value mapping and additional metadata to identify the type of slot(empty, deleted, or occupied). 

A record in the quadratic probing implementation is a data structure that encapsulates key-value pair and status info for a slot (index) in the internal array.

// Diagram: A record in the quadratic probing implementation of a hash table

To implement this data structure, we create a class with key, value, and `recordType` as its data members. The default `recordType` is set as empty. The class provides a parameterized constructor to supply values during construction.

C++

```cpp
// Represents the state of a record in the hash table
enum RecordType { EMPTY, DELETED, OCCUPIED };

// Represents an entry in the hash table
struct Record {

    // Use the separately defined RecordType enum
    RecordType state = EMPTY;
    int key = 0;
    int value = 0;

    Record() = default;
    Record(int key, int value)
        : state(OCCUPIED), key(key), value(value) {}
};
```

Java

```java
// Represents the state of a record in the hash table
enum RecordType {
    EMPTY,
    DELETED,
    OCCUPIED
}

// Represents an entry in the hash table
class Record {

    // Use the separately defined RecordType enum
    RecordType state = RecordType.EMPTY;
    int key = 0;
    int value = 0;

    Record() {}

    Record(int key, int value) {
        this.state = RecordType.OCCUPIED;
        this.key = key;
        this.value = value;
    }
```

Typescript

```typescript
// Represents the state of a record in the hash table
enum RecordType {
    EMPTY,
    DELETED,
    OCCUPIED
}

class Record {
    state: RecordType = RecordType.EMPTY;
    key: number = 0;
    value: number = 0;

// Diagram: constructor(key?: number, value?: number) {

        // Set state to OCCUPIED when key and value are provided
        if (key !== undefined && value !== undefined) {
            this.state = RecordType.OCCUPIED;
            this.key = key;
            this.value = value;
        }
```

Javascript

```javascript
// Represents the state of a record in the hash table
const RecordType = {
    EMPTY: 0,
    DELETED: 1,
    OCCUPIED: 2
};

class Record {
    constructor(key, value) {

        // Initialize state as EMPTY by default
        this.state = RecordType.EMPTY;
        this.key = 0;
        this.value = 0;

        // Set state to OCCUPIED when key and value are provided
        if (key !== undefined && value !== undefined) {
            this.state = RecordType.OCCUPIED;
            this.key = key;
            this.value = value;
        }
```

Python

```python
from enum import Enum
from typing import Optional

# Represents the state of a record in the hash table
class RecordType(Enum):
    EMPTY = 0
    DELETED = 1
    OCCUPIED = 2

# Represents an entry in the hash table
class Record:
    def __init__(
        self, key: Optional[int] = None, value: Optional[int] = None
    ):

        # Initialize state as EMPTY by default
        self.state: RecordType = RecordType.EMPTY
        self.key: int = 0
        self.value: int = 0

        # Set state to OCCUPIED when key and value are provided
        if key is not None and value is not None:
            self.state = RecordType.OCCUPIED
            self.key = key
            self.value = value
```

## Internal array

In the quadratic probing implementation of a hash table, the internal array stores all the data, so it is an array of records. Each slot in this array is either an empty or deleted record, as described by its recordType data member. We will learn later why it is important to distinguish between these two states.

// Diagram: The internal array is an array of records

Some implementations use a dynamic array instead of a fixed-sized array. If the internal array gets full, values are rehashed into a bigger array. We use a fixed-size array, however, to keep the implementation simple.

C++

```cpp
// Represents the state of a record in the hash table
enum RecordType { EMPTY, DELETED, OCCUPIED };

// Represents an entry in the hash table
struct Record {

    // Use the separately defined RecordType enum
    RecordType state = EMPTY;
    int key = 0;
    int value = 0;

    Record() = default;
    Record(int key, int value)
        : state(OCCUPIED), key(key), value(value) {}
};
```

Java

```java
// Represents the state of a record in the hash table
enum RecordType {
    EMPTY,
    DELETED,
    OCCUPIED
}

// Represents an entry in the hash table
class Record {

    // Use the separately defined RecordType enum
    RecordType state = RecordType.EMPTY;
    int key = 0;
    int value = 0;

    Record() {}

    Record(int key, int value) {
        this.state = RecordType.OCCUPIED;
        this.key = key;
        this.value = value;
    }
```

Typescript

```typescript
// Represents the state of a record in the hash table
enum RecordType {
    EMPTY,
    DELETED,
    OCCUPIED
}

class Record {
    state: RecordType = RecordType.EMPTY;
    key: number = 0;
    value: number = 0;

// Diagram: constructor(key?: number, value?: number) {

        // Set state to OCCUPIED when key and value are provided
        if (key !== undefined && value !== undefined) {
            this.state = RecordType.OCCUPIED;
            this.key = key;
            this.value = value;
        }
```

Javascript

```javascript
// Represents the state of a record in the hash table
const RecordType = {
    EMPTY: 0,
    DELETED: 1,
    OCCUPIED: 2
};

class Record {
    constructor(key, value) {

        // Initialize state as EMPTY by default
        this.state = RecordType.EMPTY;
        this.key = 0;
        this.value = 0;

        // Set state to OCCUPIED when key and value are provided
        if (key !== undefined && value !== undefined) {
            this.state = RecordType.OCCUPIED;
            this.key = key;
            this.value = value;
        }
```

Python

```python
from enum import Enum
from typing import Optional

# Represents the state of a record in the hash table
class RecordType(Enum):
    EMPTY = 0
    DELETED = 1
    OCCUPIED = 2

# Represents an entry in the hash table
class Record:
    def __init__(
        self, key: Optional[int] = None, value: Optional[int] = None
    ):

        # Initialize state as EMPTY by default
        self.state: RecordType = RecordType.EMPTY
        self.key: int = 0
        self.value: int = 0

        # Set state to OCCUPIED when key and value are provided
        if key is not None and value is not None:
            self.state = RecordType.OCCUPIED
            self.key = key
            self.value = value
```

## Hash function

The hash function is the heart of any hash table. It is a function that converts a given key to an index (hash value) in the internal array. The key value pair is then searched, inserted, or deleted in the internal array at that index. Any collision in hash values is resolved using the quadratic probing method.

// Diagram: The hash function translates keys to array indices

C++

```cpp
// Represents the state of a record in the hash table
enum RecordType { EMPTY, DELETED, OCCUPIED };

// Represents an entry in the hash table
struct Record {

    // Use the separately defined RecordType enum
    RecordType state = EMPTY;
    int key = 0;
    int value = 0;

    Record() = default;
    Record(int key, int value)
        : state(OCCUPIED), key(key), value(value) {}
};
```

Java

```java
// Represents the state of a record in the hash table
enum RecordType {
    EMPTY,
    DELETED,
    OCCUPIED
}

// Represents an entry in the hash table
class Record {

    // Use the separately defined RecordType enum
    RecordType state = RecordType.EMPTY;
    int key = 0;
    int value = 0;

    Record() {}

    Record(int key, int value) {
        this.state = RecordType.OCCUPIED;
        this.key = key;
        this.value = value;
    }
```

Typescript

```typescript
// Represents the state of a record in the hash table
enum RecordType {
    EMPTY,
    DELETED,
    OCCUPIED
}

class Record {
    state: RecordType = RecordType.EMPTY;
    key: number = 0;
    value: number = 0;

// Diagram: constructor(key?: number, value?: number) {

        // Set state to OCCUPIED when key and value are provided
        if (key !== undefined && value !== undefined) {
            this.state = RecordType.OCCUPIED;
            this.key = key;
            this.value = value;
        }
```

Javascript

```javascript
// Represents the state of a record in the hash table
const RecordType = {
    EMPTY: 0,
    DELETED: 1,
    OCCUPIED: 2
};

class Record {
    constructor(key, value) {

        // Initialize state as EMPTY by default
        this.state = RecordType.EMPTY;
        this.key = 0;
        this.value = 0;

        // Set state to OCCUPIED when key and value are provided
        if (key !== undefined && value !== undefined) {
            this.state = RecordType.OCCUPIED;
            this.key = key;
            this.value = value;
        }
```

Python

```python
from enum import Enum
from typing import Optional

# Represents the state of a record in the hash table
class RecordType(Enum):
    EMPTY = 0
    DELETED = 1
    OCCUPIED = 2

# Represents an entry in the hash table
class Record:
    def __init__(
        self, key: Optional[int] = None, value: Optional[int] = None
    ):

        # Initialize state as EMPTY by default
        self.state: RecordType = RecordType.EMPTY
        self.key: int = 0
        self.value: int = 0

        # Set state to OCCUPIED when key and value are provided
        if key is not None and value is not None:
            self.state = RecordType.OCCUPIED
            self.key = key
            self.value = value
```

## Quadratic function

A hash table implemented using quadratic probing uses a quadratic function to calculate the index of the ith collision starting from the hashed index. This quadratic function is critical to implementing the hash table and has to be fine-tuned, just like the hash function. This function calculates the probe sequence when there is a collision. It calculates the index for the ith collision for a hashed value.

// Diagram: The quadratic function calculates the index of the ith collision

Not all quadratic functions are the same when implementing a hash table. Later in the course, we will learn more about what makes a quadratic function better than others.

***

# Implementing the hash table class

Now that we know what the individual components of a hash table and its operations are implemented using quadratic probing, let us look at the hash table class that encapsulates all these components and provides public functions to expose these operations. The hash table class abstracts away the implementation details of operations and the internal data structures to provide a clean and simple-to-use interface.

// Diagram: Representation of quadratic probing implementation of a hash table encapsulated in a class

## Implementation

The hash table class is implemented by encapsulating all the components we learned earlier with the search, insert, and delete operations as public functions. The hash function and other helper functions and definitions are private to the class and need not be exposed.

C++

```cpp
using namespace std;

// Represents the state of a record in the hash table
enum RecordType { EMPTY, DELETED, OCCUPIED };

// Represents an entry in the hash table
struct Record {

    // Use the separately defined RecordType enum
    RecordType state = EMPTY;
    int key = 0;
    int value = 0;

    Record() = default;
    Record(int key, int value)
        : state(OCCUPIED), key(key), value(value) {}
};

class MyHashTable {
private:

    // The total number of slots in the hash table
    int capacity;

    // Quadratic probing constants
    int a, b;

    // The hash table implemented as a vector of Records
    vector<Record> table;

public:
    MyHashTable(int capacity, int a, int b)
        : capacity(capacity), a(a), b(b), table(capacity) {}

// Diagram: int search(int key) {}

// Diagram: bool insert(int key, int value) {}

    void remove(int key) {}
};
```

Java

```java
import java.util.*;

// Represents the state of a record in the hash table
enum RecordType {
    EMPTY,
    DELETED,
    OCCUPIED
}

// Represents an entry in the hash table
class Record {

    // Use the separately defined RecordType enum
    RecordType state = RecordType.EMPTY;
    int key = 0;
    int value = 0;

    Record() {}

    Record(int key, int value) {
        this.state = RecordType.OCCUPIED;
        this.key = key;
        this.value = value;
    }

// Diagram: class MyHashTable {

    // The total number of slots in the hash table
    private int capacity;

    // Quadratic probing constants
    private int a, b;

    // The hash table implemented as a list of Records
    private List<Record> table;

    public MyHashTable(int capacity, int a, int b) {
        this.capacity = capacity;
        this.a = a;
        this.b = b;

        // Initialize the table with empty records
        table = new ArrayList<>();
        for (int i = 0; i < capacity; i++) {
            table.add(new Record());
        }

// Diagram: public int search(int key) {}

// Diagram: public boolean insert(int key, int value) {}

    public void remove(int key) {}
}
```

Typescript

```typescript
// Represents the state of a record in the hash table
enum RecordType {
    EMPTY,
    DELETED,
    OCCUPIED
}

class Record {
    state: RecordType = RecordType.EMPTY;
    key: number = 0;
    value: number = 0;

// Diagram: constructor(key?: number, value?: number) {

        // Set state to OCCUPIED when key and value are provided
        if (key !== undefined && value !== undefined) {
            this.state = RecordType.OCCUPIED;
            this.key = key;
            this.value = value;
        }

// Diagram: export class MyHashTable {

    // The total number of slots in the hash table
    capacity: number;

    // Quadratic probing constants
    a: number;
    b: number;

    // The hash table implemented as a vector of Records
    table: Record[];

    constructor(capacity: number, a: number, b: number) {
        this.capacity = capacity;
        this.a = a;
        this.b = b;

        // Initialize the table with empty records
        this.table = new Array(capacity).fill(new Record());
    }

// Diagram: search(key: number): number {}

// Diagram: insert(key: number, value: number): boolean {}

    remove(key: number): void {}
}
```

Javascript

```javascript
// Represents the state of a record in the hash table
const RecordType = {
    EMPTY: 0,
    DELETED: 1,
    OCCUPIED: 2
};

class Record {
    constructor(key, value) {

        // Initialize state as EMPTY by default
        this.state = RecordType.EMPTY;
        this.key = 0;
        this.value = 0;

        // Set state to OCCUPIED when key and value are provided
        if (key !== undefined && value !== undefined) {
            this.state = RecordType.OCCUPIED;
            this.key = key;
            this.value = value;
        }

export class MyHashTable {
    constructor(capacity, a, b) {

        // The total number of slots in the hash table
        this.capacity = capacity;

        // Quadratic probing constants
        this.a = a;
        this.b = b;

        // Initialize the table with unique empty records
        this.table = Array.from(
            { length: capacity },
            () => new Record()
        );
    }

// Diagram: search(key) {}

// Diagram: insert(key, value) {}

    remove(key) {}
}
```

Python

```python
from enum import Enum
from typing import List, Optional

# Represents the state of a record in the hash table
class RecordType(Enum):
    EMPTY = 0
    DELETED = 1
    OCCUPIED = 2

# Represents an entry in the hash table
class Record:
    def __init__(
        self, key: Optional[int] = None, value: Optional[int] = None
    ):

        # Initialize state as EMPTY by default
        self.state: RecordType = RecordType.EMPTY
        self.key: int = 0
        self.value: int = 0

        # Set state to OCCUPIED when key and value are provided
        if key is not None and value is not None:
            self.state = RecordType.OCCUPIED
            self.key = key
            self.value = value

class MyHashTable:
    def __init__(self, capacity: int, a: int, b: int):
        self.capacity = capacity
        self.a = a
        self.b = b

        # The hash table implemented as a list of Records
        self.table: List[Record] = [Record() for _ in range(capacity)]

    def search(self, key: int) -> int:
        pass

    def insert(self, key: int, value: int) -> bool:
        pass

    def remove(self, key: int) -> None:
        pass
```

## Using the hash table class

The hash table class abstracts away the implementation details in a class. Anyone who wants to use the hash table as a data structure can instantiate an object of the hash table class we defined earlier and operate upon it by calling the exposed public functions. The caller does not need to care about the implementation detail and can focus on solving the higher-level problem.

C++

```cpp
using namespace std;

// Represents the state of a record in the hash table
enum RecordType { EMPTY, DELETED, OCCUPIED };

// Represents an entry in the hash table
struct Record {

    // Use the separately defined RecordType enum
    RecordType state = EMPTY;
    int key = 0;
    int value = 0;

    Record() = default;
    Record(int key, int value)
        : state(OCCUPIED), key(key), value(value) {}
};

class MyHashTable {
private:

    // The total number of slots in the hash table
    int capacity;

    // Quadratic probing constants
    int a, b;

    // The hash table implemented as a vector of Records
    vector<Record> table;

public:
    MyHashTable(int capacity, int a, int b)
        : capacity(capacity), a(a), b(b), table(capacity) {}

// Diagram: int search(int key) {}

// Diagram: bool insert(int key, int value) {}

    void remove(int key) {}
};
```

Java

```java
import java.util.*;

// Represents the state of a record in the hash table
enum RecordType {
    EMPTY,
    DELETED,
    OCCUPIED
}

// Represents an entry in the hash table
class Record {

    // Use the separately defined RecordType enum
    RecordType state = RecordType.EMPTY;
    int key = 0;
    int value = 0;

    Record() {}

    Record(int key, int value) {
        this.state = RecordType.OCCUPIED;
        this.key = key;
        this.value = value;
    }

// Diagram: class MyHashTable {

    // The total number of slots in the hash table
    private int capacity;

    // Quadratic probing constants
    private int a, b;

    // The hash table implemented as a list of Records
    private List<Record> table;

    public MyHashTable(int capacity, int a, int b) {
        this.capacity = capacity;
        this.a = a;
        this.b = b;

        // Initialize the table with empty records
        table = new ArrayList<>();
        for (int i = 0; i < capacity; i++) {
            table.add(new Record());
        }

// Diagram: public int search(int key) {}

// Diagram: public boolean insert(int key, int value) {}

    public void remove(int key) {}
}
```

Typescript

```typescript
// Represents the state of a record in the hash table
enum RecordType {
    EMPTY,
    DELETED,
    OCCUPIED
}

class Record {
    state: RecordType = RecordType.EMPTY;
    key: number = 0;
    value: number = 0;

// Diagram: constructor(key?: number, value?: number) {

        // Set state to OCCUPIED when key and value are provided
        if (key !== undefined && value !== undefined) {
            this.state = RecordType.OCCUPIED;
            this.key = key;
            this.value = value;
        }

// Diagram: export class MyHashTable {

    // The total number of slots in the hash table
    capacity: number;

    // Quadratic probing constants
    a: number;
    b: number;

    // The hash table implemented as a vector of Records
    table: Record[];

    constructor(capacity: number, a: number, b: number) {
        this.capacity = capacity;
        this.a = a;
        this.b = b;

        // Initialize the table with empty records
        this.table = new Array(capacity).fill(new Record());
    }

// Diagram: search(key: number): number {}

// Diagram: insert(key: number, value: number): boolean {}

    remove(key: number): void {}
}
```

Javascript

```javascript
// Represents the state of a record in the hash table
const RecordType = {
    EMPTY: 0,
    DELETED: 1,
    OCCUPIED: 2
};

class Record {
    constructor(key, value) {

        // Initialize state as EMPTY by default
        this.state = RecordType.EMPTY;
        this.key = 0;
        this.value = 0;

        // Set state to OCCUPIED when key and value are provided
        if (key !== undefined && value !== undefined) {
            this.state = RecordType.OCCUPIED;
            this.key = key;
            this.value = value;
        }

export class MyHashTable {
    constructor(capacity, a, b) {

        // The total number of slots in the hash table
        this.capacity = capacity;

        // Quadratic probing constants
        this.a = a;
        this.b = b;

        // Initialize the table with unique empty records
        this.table = Array.from(
            { length: capacity },
            () => new Record()
        );
    }

// Diagram: search(key) {}

// Diagram: insert(key, value) {}

    remove(key) {}
}
```

Python

```python
from enum import Enum
from typing import List, Optional

# Represents the state of a record in the hash table
class RecordType(Enum):
    EMPTY = 0
    DELETED = 1
    OCCUPIED = 2

# Represents an entry in the hash table
class Record:
    def __init__(
        self, key: Optional[int] = None, value: Optional[int] = None
    ):

        # Initialize state as EMPTY by default
        self.state: RecordType = RecordType.EMPTY
        self.key: int = 0
        self.value: int = 0

        # Set state to OCCUPIED when key and value are provided
        if key is not None and value is not None:
            self.state = RecordType.OCCUPIED
            self.key = key
            self.value = value

class MyHashTable:
    def __init__(self, capacity: int, a: int, b: int):
        self.capacity = capacity
        self.a = a
        self.b = b

        # The hash table implemented as a list of Records
        self.table: List[Record] = [Record() for _ in range(capacity)]

    def search(self, key: int) -> int:
        pass

    def insert(self, key: int, value: int) -> bool:
        pass

    def remove(self, key: int) -> None:
        pass
```

Let's examine what happens when the code above is executed to understand better how encapsulating all the data and operations to implement a hash table using quadratic probing is useful.

// Diagram: Execution of code using an instance (object) of the hash table class

Now that we know what the quadratic probing implementation of a hash table looks like and how it functions, we will learn more about the implementation of each operation in the coming lessons.

***

# Search operation in quadratic probing

The search operation is one of the primary operations on a hash table and is used to retrieve the value of a key as stored in the hash table. The implementation is encapsulated in the search function and relies on the quadratic probing collision resolution scheme to look for a value in the internal array. Let us look at the algorithm and implementation of the search operation in a hash table using quadratic probing.

## Algorithm

The search operation is quite simple: We only need to calculate the index (hash code) for the given key and then search for the key at the index. However, the hash table could have a collision for the given key, so we follow the quadratic probing scheme to search for it.

Once we calculate the index (hash code) for the given key, we search the array starting from that index using the quadratic function until we find an occupied record with the given key, hit an empty record, or finish the probe sequence. Let us look at the different cases separately to understand how the search operation is implemented in a hash table that uses a quadratic probing scheme for collision resolution.

### 1\. The key is present in the table

If the key is already in the hash table, we will find it when searching for it using quadratic probing in the internal array. Once we find it, we return the value of this key.

// Diagram: Search for a key that is present in the hash table

> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Search the array using quadratic probing from the calculated index.
> -   **Step 3:** If the key is found, return it's value.

### 2\. An empty slot is found

If the key is not present in the hash table and the probe sequence is not full, we will hit an empty record when we search for it using quadratic probing in the internal array. We return a flag (`-1` in this example) to indicate that the key is absent.

// Diagram: Search for a key that is not present in the hash table and the probe sequence is not full

> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Search the array using quadratic probing from the calculated index.
> -   **Step 3:** If an \`EMPTY\` slot is found while probing, return \`-1\`.

### 3\. The key is not present and the probe sequence is full

If the key is not present in the hash table and the entire probe sequence for that key is full, we will finish the entire quadratic probe starting from the hashed index and not hit any empty record. In this case, we return `-1` to indicate that the key is not in the hash table.

// Diagram: Search for a key that is not present in the hash table and the probe sequence is full

> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Search the array using quadratic probing from the calculated index.
> -   **Step 3:** If the key is not found and the probe sequence is full, return \`-1\`.

## Implementation

To implement the operation, we use the hash function to get the index in the internal array and then traverse the internal array from that index using quadratic probing to search for the given key. If, during traversal, the key of an occupied record matches the given key, we return it's value. Otherwise, we return `-1` if we find an empty record, meaning we have searched through all the collisions but couldn't find the key.

C++

```cpp
using namespace std;

// Represents the state of a record in the hash table
enum RecordType { EMPTY, DELETED, OCCUPIED };

// Represents an entry in the hash table
struct Record {

    // Use the separately defined RecordType enum
    RecordType state = EMPTY;
    int key = 0;
    int value = 0;

    Record() = default;
    Record(int key, int value)
        : state(OCCUPIED), key(key), value(value) {}
};

class MyHashTable {
private:

    // The total number of slots in the hash table
    int capacity;

    // Quadratic probing constants
    int a, b;

    // The hash table implemented as a vector of Records
    vector<Record> table;

    // Primary hash function: Computes the index as key % capacity
    int hashFunction(int key) { return key % capacity; }

    int probeForOccupiedIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Quadratic probing
            int probeIndex = (startIndex + a * i * i + b * i) % capacity;

            // Check if the slot is occupied and matches the key
            if (table[probeIndex].state == OCCUPIED &&
                table[probeIndex].key == key) {
                return probeIndex;
            }

        // Return -1 if no matching record is found
        return -1;
    }

public:
    MyHashTable(int capacity, int a, int b)
        : capacity(capacity), a(a), b(b), table(capacity) {}

// Diagram: int search(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Return the value if found, otherwise -1
        return occupiedIndex == -1 ? -1 : table[occupiedIndex].value;
    }
};
```

Java

```java
import java.util.*;

// Represents the state of a record in the hash table
enum RecordType {
    EMPTY,
    DELETED,
    OCCUPIED
}

// Represents an entry in the hash table
class Record {

    // Use the separately defined RecordType enum
    RecordType state = RecordType.EMPTY;
    int key = 0;
    int value = 0;

    Record() {}

    Record(int key, int value) {
        this.state = RecordType.OCCUPIED;
        this.key = key;
        this.value = value;
    }

// Diagram: class MyHashTable {

    // The total number of slots in the hash table
    private int capacity;

    // Quadratic probing constants
    private int a, b;

    // The hash table implemented as a list of Records
    private List<Record> table;

    // Primary hash function: Computes the index as key % capacity
    private int hashFunction(int key) {
        return key % capacity;
    }

    private int probeForOccupiedIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Quadratic probing
            int probeIndex = (startIndex + a * i * i + b * i) % capacity;

            // Check if the slot is occupied and matches the key
            if (
                table.get(probeIndex).state == RecordType.OCCUPIED &&
                table.get(probeIndex).key == key
            ) {
                return probeIndex;
            }

        // Return -1 if no matching record is found
        return -1;
    }

    public MyHashTable(int capacity, int a, int b) {
        this.capacity = capacity;
        this.a = a;
        this.b = b;

        // Initialize the table with empty records
        table = new ArrayList<>();
        for (int i = 0; i < capacity; i++) {
            table.add(new Record());
        }

// Diagram: public int search(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Return the value if found, otherwise -1
        return occupiedIndex == -1 ? -1 : table.get(occupiedIndex).value;
    }
```

Typescript

```typescript
// Represents the state of a record in the hash table
enum RecordType {
    EMPTY,
    DELETED,
    OCCUPIED
}

class Record {
    state: RecordType = RecordType.EMPTY;
    key: number = 0;
    value: number = 0;

// Diagram: constructor(key?: number, value?: number) {

        // Set state to OCCUPIED when key and value are provided
        if (key !== undefined && value !== undefined) {
            this.state = RecordType.OCCUPIED;
            this.key = key;
            this.value = value;
        }

// Diagram: export class MyHashTable {

    // The total number of slots in the hash table
    capacity: number;

    // Quadratic probing constants
    a: number;
    b: number;

    // The hash table implemented as a vector of Records
    table: Record[];

    // Primary hash function: Computes the index as key % capacity
    hashFunction(key: number): number {
        return key % this.capacity;
    }

    probeForOccupiedIndex(key: number, startIndex: number): number {
        for (let i = 0; i < this.capacity; ++i) {

            // Quadratic probing
            let probeIndex =
                (startIndex + this.a * i * i + this.b * i) %
                this.capacity;

            // Check if the slot is occupied and matches the key
            if (
                this.table[probeIndex].state === RecordType.OCCUPIED &&
                this.table[probeIndex].key === key
            ) {
                return probeIndex;
            }

        // Return -1 if no matching record is found
        return -1;
    }

    constructor(capacity: number, a: number, b: number) {
        this.capacity = capacity;
        this.a = a;
        this.b = b;

        // Initialize the table with empty records
        this.table = new Array(capacity).fill(new Record());
    }

// Diagram: search(key: number): number {

        // Compute the initial index using the primary hash function
        let startIndex = this.hashFunction(key);

        // Find the occupied index for the key
        let occupiedIndex = this.probeForOccupiedIndex(key, startIndex);

        // Return the value if found, otherwise -1
        return occupiedIndex === -1
            ? -1
            : this.table[occupiedIndex].value;
    }
```

Javascript

```javascript
// Represents the state of a record in the hash table
const RecordType = {
    EMPTY: 0,
    DELETED: 1,
    OCCUPIED: 2
};

class Record {
    constructor(key, value) {

        // Initialize state as EMPTY by default
        this.state = RecordType.EMPTY;
        this.key = 0;
        this.value = 0;

        // Set state to OCCUPIED when key and value are provided
        if (key !== undefined && value !== undefined) {
            this.state = RecordType.OCCUPIED;
            this.key = key;
            this.value = value;
        }

export class MyHashTable {
    constructor(capacity, a, b) {

        // The total number of slots in the hash table
        this.capacity = capacity;

        // Quadratic probing constants
        this.a = a;
        this.b = b;

        // Initialize the table with unique empty records
        this.table = Array.from(
            { length: capacity },
            () => new Record()
        );
    }

    // Primary hash function: Computes the index as key % capacity
    hashFunction(key) {
        return key % this.capacity;
    }

    probeForOccupiedIndex(key, startIndex) {
        for (let i = 0; i < this.capacity; ++i) {

            // Quadratic probing
            const probeIndex =
                (startIndex + this.a * i * i + this.b * i) %
                this.capacity;

            // Check if the slot is occupied and matches the key
            if (
                this.table[probeIndex].state === RecordType.OCCUPIED &&
                this.table[probeIndex].key === key
            ) {
                return probeIndex;
            }

        // Return -1 if no matching record is found
        return -1;
    }

// Diagram: search(key) {

        // Compute the initial index using the primary hash function
        const startIndex = this.hashFunction(key);

        // Find the occupied index for the key
        const occupiedIndex = this.probeForOccupiedIndex(
            key,
            startIndex
        );

        // Return the value if found, otherwise -1
        return occupiedIndex === -1
            ? -1
            : this.table[occupiedIndex].value;
    }
```

Python

```python
from enum import Enum
from typing import List, Optional

# Represents the state of a record in the hash table
class RecordType(Enum):
    EMPTY = 0
    DELETED = 1
    OCCUPIED = 2

# Represents an entry in the hash table
class Record:
    def __init__(
        self, key: Optional[int] = None, value: Optional[int] = None
    ):

        # Initialize state as EMPTY by default
        self.state: RecordType = RecordType.EMPTY
        self.key: int = 0
        self.value: int = 0

        # Set state to OCCUPIED when key and value are provided
        if key is not None and value is not None:
            self.state = RecordType.OCCUPIED
            self.key = key
            self.value = value

class MyHashTable:
    def __init__(self, capacity: int, a: int, b: int):
        self.capacity = capacity
        self.a = a
        self.b = b

        # The hash table implemented as a list of Records
        self.table: List[Record] = [Record() for _ in range(capacity)]

    # Primary hash function: Computes the index as key % capacity
    def hash_function(self, key: int) -> int:
        return key % self.capacity

    def probe_for_occupied_index(
        self, key: int, start_index: int
    ) -> int:
        for i in range(self.capacity):

            # Quadratic probing
            probe_index = (
                start_index + self.a * i * i + self.b * i
            ) % self.capacity

            # Check if the slot is occupied and matches the key
            if (
                self.table[probe_index].state == RecordType.OCCUPIED
                and self.table[probe_index].key == key
            ):
                return probe_index

        # Return -1 if no matching record is found
        return -1

    def search(self, key: int) -> int:

        # Compute the initial index using the primary hash function
        start_index = self.hash_function(key)

        # Find the occupied index for the key
        occupied_index = self.probe_for_occupied_index(key, start_index)

        # Return the value if found, otherwise -1
        return (
            -1
            if occupied_index == -1
            else self.table[occupied_index].value
        )
```

## Complexity analysis

The search operation computes the hash value of the provided key, which is a constant-time operation. However, after that, we have to traverse the array from the calculated index to search for the key. In the best case, the record at the calculated index may have the given key, so the best-case time complexity is **constant**, **O(1)**.

In the worst case, however, all the keys stored in the hash table may have collided at the same hash value (index), occupying the entire quadratic probe sequence and filling the hash table. If the given key is not in the hash table, we must still traverse all these records to confirm this. Thus, the worst-case time complexity of the search operation is **linear** **O(N)**.

// Diagram: Best case and worst case depends on the number of collisions in the hash table

Since we do not create any new data structure that depends on the size of stored data or input and only create a fixed number of temporary variables to implement the operation, the space complexity, in any case, is **constant O(1)**.

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

# Insert operation in quadratic probing

The insert operation is another primary operation on a hash table and is used to insert a key value mapping(Record) into the hash table. If the key is already in the hash table, the insert operation updates its value to the new value supplied. The implementation is encapsulated in the insert function and relies on the search operation to find the value first. Let us look at the algorithm and implementation of the insert operation in a hash table using quadratic probing.

## Algorithm

The insert operation is just an extension of the search operation. Like the search operation, we calculate the index (hash code) for the given key and search the internal array for the given key starting from that index. We need to consider three cases.

### 1\. Key is present in the table

In this case, an occupied record with the given key is found when searching the internal array using quadratic probing starting from the calculated index. We update the value of that record to the new value and return it as `true`.

// Diagram: Insert a key value mapping when the key is present in the table

> **Algorithm**
>
> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Traverse and search the array from that index using quadratic probing.
> -   **Step 3:** If the key is found, update the value of the stored record and return \`true\`.

### 2\. An unoccupied slot is found

In this case, the internal array is searched using quadratic probing starting from the calculated index, and no occupied record with the given key is found. Still, we hit an unoccupied (`EMPTY` or `DELETED`) slot. This means that the hash table did not store the key, so we updated the unoccupied record found with the key-value pair and marked it occupied. We return true to indicate that the insert operation succeeded.

// Diagram: Insert a key value mapping when the key is not present in the table and probe sequence is not full

> **Algorithm**
>
> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Traverse and search the array from that index using quadratic probing.
> -   **Step 3:** If an unoccupied (\`EMPTY\` or \`DELETED\`) slot is found, update the record with the given key-value pair, mark it \`OCCUPIED\`, and return \`true\`.

### 3\. The probe sequence is full

In this case, the internal array is searched using quadratic probing starting from the calculated index, but no record of the given key is found in the entire traversal. This means that the internal array is full. We return `false` to indicate that the insert operation failed.

// Diagram: Insert a key value mapping when the key is not present and the probe sequence is full

> **Algorithm**
>
> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Traverse and search the array from that index using quadratic probing.
> -   **Step 3:** If no unoccupied slot is found, return \`false\`.

## Implementation

We use the hash function to get the index in the internal array to implement the operation. We then combine all three cases using conditional statements and update the correct record in the array. Finally, we return a boolean value to indicate the operation's success.

C++

```cpp
using namespace std;

// Represents the state of a record in the hash table
enum RecordType { EMPTY, DELETED, OCCUPIED };

// Represents an entry in the hash table
struct Record {

    // Use the separately defined RecordType enum
    RecordType state = EMPTY;
    int key = 0;
    int value = 0;

    Record() = default;
    Record(int key, int value)
        : state(OCCUPIED), key(key), value(value) {}
};

class MyHashTable {
private:

    // The total number of slots in the hash table
    int capacity;

    // Quadratic probing constants
    int a, b;

    // The hash table implemented as a vector of Records
    vector<Record> table;

    // Primary hash function: Computes the index as key % capacity
    int hashFunction(int key) { return key % capacity; }

    int probeForOccupiedIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Quadratic probing
            int probeIndex = (startIndex + a * i * i + b * i) % capacity;

            // Check if the slot is occupied and matches the key
            if (table[probeIndex].state == OCCUPIED &&
                table[probeIndex].key == key) {
                return probeIndex;
            }

        // Return -1 if no matching record is found
        return -1;
    }

    int probeForEmptyIndex(int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Quadratic probing
            int probeIndex = (startIndex + a * i * i + b * i) % capacity;

            // Check if the slot is available (either EMPTY or DELETED)
            if (table[probeIndex].state != OCCUPIED) {
                return probeIndex;
            }

        // Return -1 if no available slot is found
        return -1;
    }

public:
    MyHashTable(int capacity, int a, int b)
        : capacity(capacity), a(a), b(b), table(capacity) {}

// Diagram: int search(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Return the value if found, otherwise -1
        return occupiedIndex == -1 ? -1 : table[occupiedIndex].value;
    }

// Diagram: bool insert(int key, int value) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Update the value if the key exists
        if (occupiedIndex != -1) {
            table[occupiedIndex].value = value;
            return true;
        }

        // Find an empty slot to insert the new key-value pair
        int emptyIndex = probeForEmptyIndex(startIndex);
        if (emptyIndex != -1) {
            table[emptyIndex] = Record(key, value);
            return true;
        }

        // Return false if the table is full and insertion fails
        return false;
    }
};
```

Java

```java
import java.util.*;

// Represents the state of a record in the hash table
enum RecordType {
    EMPTY,
    DELETED,
    OCCUPIED
}

// Represents an entry in the hash table
class Record {

    // Use the separately defined RecordType enum
    RecordType state = RecordType.EMPTY;
    int key = 0;
    int value = 0;

    Record() {}

    Record(int key, int value) {
        this.state = RecordType.OCCUPIED;
        this.key = key;
        this.value = value;
    }

// Diagram: class MyHashTable {

    // The total number of slots in the hash table
    private int capacity;

    // Quadratic probing constants
    private int a, b;

    // The hash table implemented as a list of Records
    private List<Record> table;

    // Primary hash function: Computes the index as key % capacity
    private int hashFunction(int key) {
        return key % capacity;
    }

    private int probeForOccupiedIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Quadratic probing
            int probeIndex = (startIndex + a * i * i + b * i) % capacity;

            // Check if the slot is occupied and matches the key
            if (
                table.get(probeIndex).state == RecordType.OCCUPIED &&
                table.get(probeIndex).key == key
            ) {
                return probeIndex;
            }

        // Return -1 if no matching record is found
        return -1;
    }

    private int probeForEmptyIndex(int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Quadratic probing
            int probeIndex = (startIndex + a * i * i + b * i) % capacity;

            // Check if the slot is available (either EMPTY or DELETED)
            if (table.get(probeIndex).state != RecordType.OCCUPIED) {
                return probeIndex;
            }

        // Return -1 if no available slot is found
        return -1;
    }

    public MyHashTable(int capacity, int a, int b) {
        this.capacity = capacity;
        this.a = a;
        this.b = b;

        // Initialize the table with empty records
        table = new ArrayList<>();
        for (int i = 0; i < capacity; i++) {
            table.add(new Record());
        }

// Diagram: public int search(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Return the value if found, otherwise -1
        return occupiedIndex == -1 ? -1 : table.get(occupiedIndex).value;
    }

// Diagram: public boolean insert(int key, int value) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Update the value if the key exists
        if (occupiedIndex != -1) {
            table.get(occupiedIndex).value = value;
            return true;
        }

        // Find an empty slot to insert the new key-value pair
        int emptyIndex = probeForEmptyIndex(startIndex);
        if (emptyIndex != -1) {
            table.set(emptyIndex, new Record(key, value));
            return true;
        }

        // Return false if the table is full and insertion fails
        return false;
    }
```

Typescript

```typescript
// Represents the state of a record in the hash table
enum RecordType {
    EMPTY,
    DELETED,
    OCCUPIED
}

class Record {
    state: RecordType = RecordType.EMPTY;
    key: number = 0;
    value: number = 0;

// Diagram: constructor(key?: number, value?: number) {

        // Set state to OCCUPIED when key and value are provided
        if (key !== undefined && value !== undefined) {
            this.state = RecordType.OCCUPIED;
            this.key = key;
            this.value = value;
        }

// Diagram: export class MyHashTable {

    // The total number of slots in the hash table
    capacity: number;

    // Quadratic probing constants
    a: number;
    b: number;

    // The hash table implemented as a vector of Records
    table: Record[];

    // Primary hash function: Computes the index as key % capacity
    hashFunction(key: number): number {
        return key % this.capacity;
    }

    probeForOccupiedIndex(key: number, startIndex: number): number {
        for (let i = 0; i < this.capacity; ++i) {

            // Quadratic probing
            let probeIndex =
                (startIndex + this.a * i * i + this.b * i) %
                this.capacity;

            // Check if the slot is occupied and matches the key
            if (
                this.table[probeIndex].state === RecordType.OCCUPIED &&
                this.table[probeIndex].key === key
            ) {
                return probeIndex;
            }

        // Return -1 if no matching record is found
        return -1;
    }

    probeForEmptyIndex(startIndex: number): number {
        for (let i = 0; i < this.capacity; ++i) {

            // Quadratic probing
            let probeIndex =
                (startIndex + this.a * i * i + this.b * i) %
                this.capacity;

            // Check if the slot is available (either EMPTY or DELETED)
            if (this.table[probeIndex].state !== RecordType.OCCUPIED) {
                return probeIndex;
            }

        // Return -1 if no available slot is found
        return -1;
    }

    constructor(capacity: number, a: number, b: number) {
        this.capacity = capacity;
        this.a = a;
        this.b = b;

        // Initialize the table with empty records
        this.table = new Array(capacity).fill(new Record());
    }

// Diagram: search(key: number): number {

        // Compute the initial index using the primary hash function
        let startIndex = this.hashFunction(key);

        // Find the occupied index for the key
        let occupiedIndex = this.probeForOccupiedIndex(key, startIndex);

        // Return the value if found, otherwise -1
        return occupiedIndex === -1
            ? -1
            : this.table[occupiedIndex].value;
    }

// Diagram: insert(key: number, value: number): boolean {

        // Compute the initial index using the primary hash function
        let startIndex = this.hashFunction(key);

        // Find the occupied index for the key
        let occupiedIndex = this.probeForOccupiedIndex(key, startIndex);

        // Update the value if the key exists
        if (occupiedIndex !== -1) {
            this.table[occupiedIndex].value = value;
            return true;
        }

        // Find an empty slot to insert the new key-value pair
        let emptyIndex = this.probeForEmptyIndex(startIndex);
        if (emptyIndex !== -1) {
            this.table[emptyIndex] = new Record(key, value);
            return true;
        }

        // Return false if the table is full and insertion fails
        return false;
    }
```

Javascript

```javascript
// Represents the state of a record in the hash table
const RecordType = {
    EMPTY: 0,
    DELETED: 1,
    OCCUPIED: 2
};

class Record {
    constructor(key, value) {

        // Initialize state as EMPTY by default
        this.state = RecordType.EMPTY;
        this.key = 0;
        this.value = 0;

        // Set state to OCCUPIED when key and value are provided
        if (key !== undefined && value !== undefined) {
            this.state = RecordType.OCCUPIED;
            this.key = key;
            this.value = value;
        }

export class MyHashTable {
    constructor(capacity, a, b) {

        // The total number of slots in the hash table
        this.capacity = capacity;

        // Quadratic probing constants
        this.a = a;
        this.b = b;

        // Initialize the table with unique empty records
        this.table = Array.from(
            { length: capacity },
            () => new Record()
        );
    }

    // Primary hash function: Computes the index as key % capacity
    hashFunction(key) {
        return key % this.capacity;
    }

    probeForOccupiedIndex(key, startIndex) {
        for (let i = 0; i < this.capacity; ++i) {

            // Quadratic probing
            const probeIndex =
                (startIndex + this.a * i * i + this.b * i) %
                this.capacity;

            // Check if the slot is occupied and matches the key
            if (
                this.table[probeIndex].state === RecordType.OCCUPIED &&
                this.table[probeIndex].key === key
            ) {
                return probeIndex;
            }

        // Return -1 if no matching record is found
        return -1;
    }

    probeForEmptyIndex(startIndex) {
        for (let i = 0; i < this.capacity; ++i) {

            // Quadratic probing
            const probeIndex =
                (startIndex + this.a * i * i + this.b * i) %
                this.capacity;

            // Check if the slot is available (either EMPTY or DELETED)
            if (this.table[probeIndex].state !== RecordType.OCCUPIED) {
                return probeIndex;
            }

        // Return -1 if no available slot is found
        return -1;
    }

// Diagram: search(key) {

        // Compute the initial index using the primary hash function
        const startIndex = this.hashFunction(key);

        // Find the occupied index for the key
        const occupiedIndex = this.probeForOccupiedIndex(
            key,
            startIndex
        );

        // Return the value if found, otherwise -1
        return occupiedIndex === -1
            ? -1
            : this.table[occupiedIndex].value;
    }

// Diagram: insert(key, value) {

        // Compute the initial index using the primary hash function
        const startIndex = this.hashFunction(key);

        // Find the occupied index for the key
        const occupiedIndex = this.probeForOccupiedIndex(
            key,
            startIndex
        );

        // Update the value if the key exists
        if (occupiedIndex !== -1) {
            this.table[occupiedIndex].value = value;
            return true;
        }

        // Find an empty slot to insert the new key-value pair
        const emptyIndex = this.probeForEmptyIndex(startIndex);
        if (emptyIndex !== -1) {
            this.table[emptyIndex] = new Record(key, value);
            return true;
        }

        // Return false if the table is full and insertion fails
        return false;
    }
```

Python

```python
from enum import Enum
from typing import List, Optional

# Represents the state of a record in the hash table
class RecordType(Enum):
    EMPTY = 0
    DELETED = 1
    OCCUPIED = 2

# Represents an entry in the hash table
class Record:
    def __init__(
        self, key: Optional[int] = None, value: Optional[int] = None
    ):

        # Initialize state as EMPTY by default
        self.state: RecordType = RecordType.EMPTY
        self.key: int = 0
        self.value: int = 0

        # Set state to OCCUPIED when key and value are provided
        if key is not None and value is not None:
            self.state = RecordType.OCCUPIED
            self.key = key
            self.value = value

class MyHashTable:
    def __init__(self, capacity: int, a: int, b: int):
        self.capacity = capacity
        self.a = a
        self.b = b

        # The hash table implemented as a list of Records
        self.table: List[Record] = [Record() for _ in range(capacity)]

    # Primary hash function: Computes the index as key % capacity
    def hash_function(self, key: int) -> int:
        return key % self.capacity

    def probe_for_occupied_index(
        self, key: int, start_index: int
    ) -> int:
        for i in range(self.capacity):

            # Quadratic probing
            probe_index = (
                start_index + self.a * i * i + self.b * i
            ) % self.capacity

            # Check if the slot is occupied and matches the key
            if (
                self.table[probe_index].state == RecordType.OCCUPIED
                and self.table[probe_index].key == key
            ):
                return probe_index

        # Return -1 if no matching record is found
        return -1

    def probe_for_empty_index(self, start_index: int) -> int:
        for i in range(self.capacity):

            # Quadratic probing
            probe_index = (
                start_index + self.a * i * i + self.b * i
            ) % self.capacity

            # Check if the slot is available (either EMPTY or DELETED)
            if self.table[probe_index].state != RecordType.OCCUPIED:
                return probe_index

        # Return -1 if no available slot is found
        return -1

    def search(self, key: int) -> int:

        # Compute the initial index using the primary hash function
        start_index = self.hash_function(key)

        # Find the occupied index for the key
        occupied_index = self.probe_for_occupied_index(key, start_index)

        # Return the value if found, otherwise -1
        return (
            -1
            if occupied_index == -1
            else self.table[occupied_index].value
        )

    def insert(self, key: int, value: int) -> bool:

        # Compute the initial index using the primary hash function
        start_index = self.hash_function(key)

        # Find the occupied index for the key
        occupied_index = self.probe_for_occupied_index(key, start_index)

        # Update the value if the key exists
        if occupied_index != -1:
            self.table[occupied_index].value = value
            return True

        # Find an empty slot to insert the new key-value pair
        empty_index = self.probe_for_empty_index(start_index)
        if empty_index != -1:
            self.table[empty_index] = Record(key, value)
            return True

        # Return false if the table is full and insertion fails
        return False
```

## Complexity analysis

The insert operation computes the hash value of the provided key, which is a constant-time operation. However, after that, we have to traverse the array from the calculated index to search for an empty record. In the best case, the record at the calculated index might be empty, so the time complexity will be **constant**, **O(1)**.

In the worst case, however, all the keys stored in the hash table may have collided at the same hash value (index), occupying the entire quadratic probe sequence and filling the hash table. If the given key is not in the hash table, we must still traverse all these records to confirm this. Thus, the worst-case time complexity of the search operation is **linear** **O(N)**.

// Diagram: Best case and worst case depends on the number of collisions in the hash table

Since we do not create any new data structure that depends on the size of stored data or input and only create a fixed number of temporary variables to implement the operation, the space complexity, in any case, is **constant O(1)**.

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

# Delete operation in quadratic probing

The delete operation is another primary operation on a hash table. It deletes a key-value mapping from the hash table. Nothing is done if the key is absent in the hash table. The implementation is encapsulated in the delete function, which uses quadratic probing to search for the key in the internal array. Let us look at the algorithm and implementation of the delete operation in a hash table using quadratic probing.

## Algorithm

The delete operation is also an extension of the search operation. Like the search operation, we calculate the index (hash code) for the given key and search the internal array for a record with the given key starting from the calculated index. We may need to consider three cases.

### 1\. Key is present in the table

In this case, the key is found in an occupied record when searching the internal array using quadratic probing starting from the calculated index. We update the record to mark it `DELETED`. This deleted record can be reused when inserting a new key-value pair in the hash table. The search operation only terminates at an empty record, so it skips any deleted records.

// Diagram: Delete a key that is present in the table

> **Algorithm**
>
> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Traverse and search the array from that index using quadratic probing.
> -   **Step 3:** If the key is found, mark the slot \`DELETED\`.

### 2\. An empty slot is found

Suppose the key is not found in any occupied record when searching the internal array using quadratic probing from the calculated index. In that case, the delete operation becomes a no-op (nothing is done). This can happen if we reach an empty record before finding the key.

// Diagram: Delete a key that is not present in the table

> **Algorithm**
>
> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Traverse and search the array from that index using quadratic probing.
> -   **Step 3:** If an empty slot is reached before finding the key, terminate the operation (no-op).

### 3\. The probe sequence is full

If the key is not present in the hash table and the entire probe sequence for that key is full, we will finish the entire quadratic probe starting from the hashed index and not hit any empty record. In this case, the delete operation becomes a no-op (nothing is done).

// Diagram: Delete a key that is not present and the probe sequence is full

> **Algorithm**
>
> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Traverse and search the array from that index using quadratic probing.
> -   **Step 3:** If the entire probe sequence is traversed without finding the key or an empty slot, terminate the operation (no-op).

## Implementation

We use the hash function to get the index in the internal array to implement the operation. We then combine the two cases using conditional statements and mark the record deleted in the internal array if it is found.

C++

```cpp
using namespace std;

// Represents the state of a record in the hash table
enum RecordType { EMPTY, DELETED, OCCUPIED };

// Represents an entry in the hash table
struct Record {

    // Use the separately defined RecordType enum
    RecordType state = EMPTY;
    int key = 0;
    int value = 0;

    Record() = default;
    Record(int key, int value)
        : state(OCCUPIED), key(key), value(value) {}
};

class MyHashTable {
private:

    // The total number of slots in the hash table
    int capacity;

    // Quadratic probing constants
    int a, b;

    // The hash table implemented as a vector of Records
    vector<Record> table;

    // Primary hash function: Computes the index as key % capacity
    int hashFunction(int key) { return key % capacity; }

    int probeForOccupiedIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Quadratic probing
            int probeIndex = (startIndex + a * i * i + b * i) % capacity;

            // Check if the slot is occupied and matches the key
            if (table[probeIndex].state == OCCUPIED &&
                table[probeIndex].key == key) {
                return probeIndex;
            }

        // Return -1 if no matching record is found
        return -1;
    }

    int probeForEmptyIndex(int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Quadratic probing
            int probeIndex = (startIndex + a * i * i + b * i) % capacity;

            // Check if the slot is available (either EMPTY or DELETED)
            if (table[probeIndex].state != OCCUPIED) {
                return probeIndex;
            }

        // Return -1 if no available slot is found
        return -1;
    }

public:
    MyHashTable(int capacity, int a, int b)
        : capacity(capacity), a(a), b(b), table(capacity) {}

// Diagram: int search(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Return the value if found, otherwise -1
        return occupiedIndex == -1 ? -1 : table[occupiedIndex].value;
    }

// Diagram: bool insert(int key, int value) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Update the value if the key exists
        if (occupiedIndex != -1) {
            table[occupiedIndex].value = value;
            return true;
        }

        // Find an empty slot to insert the new key-value pair
        int emptyIndex = probeForEmptyIndex(startIndex);
        if (emptyIndex != -1) {
            table[emptyIndex] = Record(key, value);
            return true;
        }

        // Return false if the table is full and insertion fails
        return false;
    }

// Diagram: void remove(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Mark the slot as DELETED
        if (occupiedIndex != -1) {
            table[occupiedIndex].state = DELETED;
        }
};
```

Java

```java
import java.util.*;

// Represents the state of a record in the hash table
enum RecordType {
    EMPTY,
    DELETED,
    OCCUPIED
}

// Represents an entry in the hash table
class Record {

    // Use the separately defined RecordType enum
    RecordType state = RecordType.EMPTY;
    int key = 0;
    int value = 0;

    Record() {}

    Record(int key, int value) {
        this.state = RecordType.OCCUPIED;
        this.key = key;
        this.value = value;
    }

// Diagram: class MyHashTable {

    // The total number of slots in the hash table
    private int capacity;

    // Quadratic probing constants
    private int a, b;

    // The hash table implemented as a list of Records
    private List<Record> table;

    // Primary hash function: Computes the index as key % capacity
    private int hashFunction(int key) {
        return key % capacity;
    }

    private int probeForOccupiedIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Quadratic probing
            int probeIndex = (startIndex + a * i * i + b * i) % capacity;

            // Check if the slot is occupied and matches the key
            if (
                table.get(probeIndex).state == RecordType.OCCUPIED &&
                table.get(probeIndex).key == key
            ) {
                return probeIndex;
            }

        // Return -1 if no matching record is found
        return -1;
    }

    private int probeForEmptyIndex(int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Quadratic probing
            int probeIndex = (startIndex + a * i * i + b * i) % capacity;

            // Check if the slot is available (either EMPTY or DELETED)
            if (table.get(probeIndex).state != RecordType.OCCUPIED) {
                return probeIndex;
            }

        // Return -1 if no available slot is found
        return -1;
    }

    public MyHashTable(int capacity, int a, int b) {
        this.capacity = capacity;
        this.a = a;
        this.b = b;

        // Initialize the table with empty records
        table = new ArrayList<>();
        for (int i = 0; i < capacity; i++) {
            table.add(new Record());
        }

// Diagram: public int search(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Return the value if found, otherwise -1
        return occupiedIndex == -1 ? -1 : table.get(occupiedIndex).value;
    }

// Diagram: public boolean insert(int key, int value) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Update the value if the key exists
        if (occupiedIndex != -1) {
            table.get(occupiedIndex).value = value;
            return true;
        }

        // Find an empty slot to insert the new key-value pair
        int emptyIndex = probeForEmptyIndex(startIndex);
        if (emptyIndex != -1) {
            table.set(emptyIndex, new Record(key, value));
            return true;
        }

        // Return false if the table is full and insertion fails
        return false;
    }

// Diagram: public void remove(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Mark the slot as DELETED
        if (occupiedIndex != -1) {
            table.get(occupiedIndex).state = RecordType.DELETED;
        }
```

Typescript

```typescript
// Represents the state of a record in the hash table
enum RecordType {
    EMPTY,
    DELETED,
    OCCUPIED
}

class Record {
    state: RecordType = RecordType.EMPTY;
    key: number = 0;
    value: number = 0;

// Diagram: constructor(key?: number, value?: number) {

        // Set state to OCCUPIED when key and value are provided
        if (key !== undefined && value !== undefined) {
            this.state = RecordType.OCCUPIED;
            this.key = key;
            this.value = value;
        }

// Diagram: export class MyHashTable {

    // The total number of slots in the hash table
    capacity: number;

    // Quadratic probing constants
    a: number;
    b: number;

    // The hash table implemented as a vector of Records
    table: Record[];

    // Primary hash function: Computes the index as key % capacity
    hashFunction(key: number): number {
        return key % this.capacity;
    }

    probeForOccupiedIndex(key: number, startIndex: number): number {
        for (let i = 0; i < this.capacity; ++i) {

            // Quadratic probing
            let probeIndex =
                (startIndex + this.a * i * i + this.b * i) %
                this.capacity;

            // Check if the slot is occupied and matches the key
            if (
                this.table[probeIndex].state === RecordType.OCCUPIED &&
                this.table[probeIndex].key === key
            ) {
                return probeIndex;
            }

        // Return -1 if no matching record is found
        return -1;
    }

    probeForEmptyIndex(startIndex: number): number {
        for (let i = 0; i < this.capacity; ++i) {

            // Quadratic probing
            let probeIndex =
                (startIndex + this.a * i * i + this.b * i) %
                this.capacity;

            // Check if the slot is available (either EMPTY or DELETED)
            if (this.table[probeIndex].state !== RecordType.OCCUPIED) {
                return probeIndex;
            }

        // Return -1 if no available slot is found
        return -1;
    }

    constructor(capacity: number, a: number, b: number) {
        this.capacity = capacity;
        this.a = a;
        this.b = b;

        // Initialize the table with empty records
        this.table = Array.from(
            { length: capacity },
            () => new Record()
        );
    }

// Diagram: search(key: number): number {

        // Compute the initial index using the primary hash function
        let startIndex = this.hashFunction(key);

        // Find the occupied index for the key
        let occupiedIndex = this.probeForOccupiedIndex(key, startIndex);

        // Return the value if found, otherwise -1
        return occupiedIndex === -1
            ? -1
            : this.table[occupiedIndex].value;
    }

// Diagram: insert(key: number, value: number): boolean {

        // Compute the initial index using the primary hash function
        let startIndex = this.hashFunction(key);

        // Find the occupied index for the key
        let occupiedIndex = this.probeForOccupiedIndex(key, startIndex);

        // Update the value if the key exists
        if (occupiedIndex !== -1) {
            this.table[occupiedIndex].value = value;
            return true;
        }

        // Find an empty slot to insert the new key-value pair
        let emptyIndex = this.probeForEmptyIndex(startIndex);
        if (emptyIndex !== -1) {
            this.table[emptyIndex] = new Record(key, value);
            return true;
        }

        // Return false if the table is full and insertion fails
        return false;
    }

// Diagram: remove(key: number): void {

        // Compute the initial index using the primary hash function
        let startIndex = this.hashFunction(key);

        // Find the occupied index for the key
        let occupiedIndex = this.probeForOccupiedIndex(key, startIndex);

        // Mark the slot as DELETED
        if (occupiedIndex !== -1) {
            this.table[occupiedIndex].state = RecordType.DELETED;
        }
```

Javascript

```javascript
// Represents the state of a record in the hash table
const RecordType = {
    EMPTY: 0,
    DELETED: 1,
    OCCUPIED: 2
};

class Record {
    constructor(key, value) {

        // Initialize state as EMPTY by default
        this.state = RecordType.EMPTY;
        this.key = 0;
        this.value = 0;

        // Set state to OCCUPIED when key and value are provided
        if (key !== undefined && value !== undefined) {
            this.state = RecordType.OCCUPIED;
            this.key = key;
            this.value = value;
        }

export class MyHashTable {
    constructor(capacity, a, b) {

        // The total number of slots in the hash table
        this.capacity = capacity;

        // Quadratic probing constants
        this.a = a;
        this.b = b;

        // Initialize the table with unique empty records
        this.table = Array.from(
            { length: capacity },
            () => new Record()
        );
    }

    // Primary hash function: Computes the index as key % capacity
    hashFunction(key) {
        return key % this.capacity;
    }

    probeForOccupiedIndex(key, startIndex) {
        for (let i = 0; i < this.capacity; ++i) {

            // Quadratic probing
            const probeIndex =
                (startIndex + this.a * i * i + this.b * i) %
                this.capacity;

            // Check if the slot is occupied and matches the key
            if (
                this.table[probeIndex].state === RecordType.OCCUPIED &&
                this.table[probeIndex].key === key
            ) {
                return probeIndex;
            }

        // Return -1 if no matching record is found
        return -1;
    }

    probeForEmptyIndex(startIndex) {
        for (let i = 0; i < this.capacity; ++i) {

            // Quadratic probing
            const probeIndex =
                (startIndex + this.a * i * i + this.b * i) %
                this.capacity;

            // Check if the slot is available (either EMPTY or DELETED)
            if (this.table[probeIndex].state !== RecordType.OCCUPIED) {
                return probeIndex;
            }

        // Return -1 if no available slot is found
        return -1;
    }

// Diagram: search(key) {

        // Compute the initial index using the primary hash function
        const startIndex = this.hashFunction(key);

        // Find the occupied index for the key
        const occupiedIndex = this.probeForOccupiedIndex(
            key,
            startIndex
        );

        // Return the value if found, otherwise -1
        return occupiedIndex === -1
            ? -1
            : this.table[occupiedIndex].value;
    }

// Diagram: insert(key, value) {

        // Compute the initial index using the primary hash function
        const startIndex = this.hashFunction(key);

        // Find the occupied index for the key
        const occupiedIndex = this.probeForOccupiedIndex(
            key,
            startIndex
        );

        // Update the value if the key exists
        if (occupiedIndex !== -1) {
            this.table[occupiedIndex].value = value;
            return true;
        }

        // Find an empty slot to insert the new key-value pair
        const emptyIndex = this.probeForEmptyIndex(startIndex);
        if (emptyIndex !== -1) {
            this.table[emptyIndex] = new Record(key, value);
            return true;
        }

        // Return false if the table is full and insertion fails
        return false;
    }

// Diagram: remove(key) {

        // Compute the initial index using the primary hash function
        const startIndex = this.hashFunction(key);

        // Find the occupied index for the key
        const occupiedIndex = this.probeForOccupiedIndex(
            key,
            startIndex
        );

        // Mark the slot as DELETED
        if (occupiedIndex !== -1) {
            this.table[occupiedIndex].state = RecordType.DELETED;
        }
```

Python

```python
from enum import Enum
from typing import List, Optional

# Represents the state of a record in the hash table
class RecordType(Enum):
    EMPTY = 0
    DELETED = 1
    OCCUPIED = 2

# Represents an entry in the hash table
class Record:
    def __init__(
        self, key: Optional[int] = None, value: Optional[int] = None
    ):

        # Initialize state as EMPTY by default
        self.state: RecordType = RecordType.EMPTY
        self.key: int = 0
        self.value: int = 0

        # Set state to OCCUPIED when key and value are provided
        if key is not None and value is not None:
            self.state = RecordType.OCCUPIED
            self.key = key
            self.value = value

class MyHashTable:
    def __init__(self, capacity: int, a: int, b: int):
        self.capacity = capacity
        self.a = a
        self.b = b

        # The hash table implemented as a list of Records
        self.table: List[Record] = [Record() for _ in range(capacity)]

    # Primary hash function: Computes the index as key % capacity
    def hash_function(self, key: int) -> int:
        return key % self.capacity

    def probe_for_occupied_index(
        self, key: int, start_index: int
    ) -> int:
        for i in range(self.capacity):

            # Quadratic probing
            probe_index = (
                start_index + self.a * i * i + self.b * i
            ) % self.capacity

            # Check if the slot is occupied and matches the key
            if (
                self.table[probe_index].state == RecordType.OCCUPIED
                and self.table[probe_index].key == key
            ):
                return probe_index

        # Return -1 if no matching record is found
        return -1

    def probe_for_empty_index(self, start_index: int) -> int:
        for i in range(self.capacity):

            # Quadratic probing
            probe_index = (
                start_index + self.a * i * i + self.b * i
            ) % self.capacity

            # Check if the slot is available (either EMPTY or DELETED)
            if self.table[probe_index].state != RecordType.OCCUPIED:
                return probe_index

        # Return -1 if no available slot is found
        return -1

    def search(self, key: int) -> int:

        # Compute the initial index using the primary hash function
        start_index = self.hash_function(key)

        # Find the occupied index for the key
        occupied_index = self.probe_for_occupied_index(key, start_index)

        # Return the value if found, otherwise -1
        return (
            -1
            if occupied_index == -1
            else self.table[occupied_index].value
        )

    def insert(self, key: int, value: int) -> bool:

        # Compute the initial index using the primary hash function
        start_index = self.hash_function(key)

        # Find the occupied index for the key
        occupied_index = self.probe_for_occupied_index(key, start_index)

        # Update the value if the key exists
        if occupied_index != -1:
            self.table[occupied_index].value = value
            return True

        # Find an empty slot to insert the new key-value pair
        empty_index = self.probe_for_empty_index(start_index)
        if empty_index != -1:
            self.table[empty_index] = Record(key, value)
            return True

        # Return false if the table is full and insertion fails
        return False

    def remove(self, key: int) -> None:

        # Compute the initial index using the primary hash function
        start_index = self.hash_function(key)

        # Find the occupied index for the key
        occupied_index = self.probe_for_occupied_index(key, start_index)

        # Mark the slot as DELETED
        if occupied_index != -1:
            self.table[occupied_index].state = RecordType.DELETED
```

## Complexity analysis

The delete operation computes the hash value of the provided key, which is a constant-time operation. However, after that, we have to traverse the array from the calculated index to search for an occupied record with the given key. In the best case, the record at the calculated index may have the given key, so the best-case time complexity is **constant**, **O(1)**.

In the worst case, however, all the keys stored in the hash table may have collided at the same hash value (index), occupying the entire quadratic probe sequence and filling the hash table. If the given key is not in the hash table, we must still traverse all these records to confirm this. Thus, the worst-case time complexity of the delete operation is **linear** **O(N)**.

// Diagram: Best case and worst case depends on the number of collisions in the hash table

To delete a key, we do not create any new data structure that depends on the size of stored data or input. We only create a fixed number of temporary variables to implement the operation. Thus, the space complexity is **constant O(1)**.

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

# Design a hash table with quadratic probing

## Problem Statement

Given the skeleton of a **HashTable** class, complete this class by implementing all the hash table operations below.

> -   **MyHashTable(int capacity, int a, int b)** - Initializes the hash table object with the given capacity for the internal data structure and stores quadratic constants a and b.
> -   **search(int key)** - Returns the value mapped to the given key, or \`-1\` if the key is absent.
> -   **insert(int key, int value)** - Inserts a (key, value) pair into the hash table. If the key already exists, it updates the value. Returns \`true\` if the operation is successful; otherwise, returns \`false\`.
> -   **remove(int key)** - Removes the key and its corresponding value if the mapping for the key exists in the key.
> -   **getKeyAtIndex(int index)** - Returns the key mapped to the given index in the internal data structure.

// Diagram: You must abide by the following constraints

// Diagram: 1\. You must implement this without using any built-in hash table libraries

2. **Quadratic probing** must be used as a collision resolution strategy. You will be provided with the quadratic coefficients `a` and `b` values in the input.

> The input should adhere to the following rules:
>
> 1.  The input should contain two arrays of the same size.
> 2.  The first array should contain the list of operations, while the second should contain the corresponding operands for those operations.
> 3.  The first index in the first array should contain **MyHashTable**, and the first index in the second array should contain three positive integers denoting the capacity of the hash table and the values of quadratic coefficients \`a\` and \`b\`, respectively. These values are used to initialise the hash table.
> 4.  For each index in the first array that contains the **insert** operation, the corresponding index in the second array should contain a (key, value) pair to be inserted.
> 5.  For each index in the first array that contains **search** or **remove** operations, the corresponding index in the second array should contain the key for which that operation will be performed.
> 6.  For each index in the first array that contains the **getKeyAtIndex** operation, the corresponding index in the second array should contain the index for which the operation will be performed.
>
> **Example:**
>
> -   **Input:** \[MyHashTable, insert, insert, search, insert, search, insert, search, search, getKeyAtIndex\] \[\[3, 2, 3\], \[1, 2\], \[2, 4\], \[1\], \[1, 3\], \[1\], \[2, 5\], \[2\], \[3\], \[0\]\]
>
> -   **Output:** \[null, true, true, 2, true, 3, true, 5, -1, -1\]
>
> **Explanation:**
>
> **Operation:** MyHashTable myHashTable = new MyHashTable(3, 2, 3) **Result:** Initializes an empty \`MyHashTable\` with a capacity of 3 and stores the quadratic coefficients \`a = 2\` and \`b = 3\`.
>
> **Operation:** myHashTable.insert(1, 2) **Result:** \`table = \[EMPTY, \[1, 2\], EMPTY\]\`, returns \`true\`
>
> **Operation:** myHashTable.insert(2, 4) **Result:** \`table = \[EMPTY, \[1, 2\], \[2, 4\]\]\`, returns \`true\`
>
> **Operation:** myHashTable.search(1) **Result:** Returns \`2\`
>
> **Operation:** myHashTable.insert(1, 3) **Result:** \`table = \[EMPTY, \[1, 3\], \[2, 4\]\]\`, returns \`true\`
>
> **Operation:** myHashTable.search(1) **Result:** Returns \`3\`
>
> **Operation:** myHashTable.insert(2, 5) **Result:** \`table = \[EMPTY, \[1, 3\], \[2, 5\]\]\`, returns \`true\`
>
> **Operation:** myHashTable.search(2) **Result:** Returns \`5\`
>
> **Operation:** myHashTable.search(3) **Result:** Returns \`-1\`
>
> **Operation:** myHashTable.getKeyAtIndex(0) **Result:** At index 0 of the hash table, we don't have any record, so it returns \`-1\`

## Solution

```cpp
using namespace std;

// Represents the state of a record in the hash table
enum RecordType { EMPTY, DELETED, OCCUPIED };

// Represents an entry in the hash table
struct Record {

    // Use the separately defined RecordType enum
    RecordType state = EMPTY;
    int key = 0;
    int value = 0;

    Record() = default;
    Record(int key, int value)
        : state(OCCUPIED), key(key), value(value) {}
};

class MyHashTable {
private:

    // The total number of slots in the hash table
    int capacity;

    // Quadratic probing constants
    int a, b;

    // The hash table implemented as a vector of Records
    vector<Record> table;

    // Primary hash function: Computes the index as key % capacity
    int hashFunction(int key) { return key % capacity; }

    int probeForOccupiedIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Quadratic probing
            int probeIndex = (startIndex + a * i * i + b * i) % capacity;

            // Check if the slot is occupied and matches the key
            if (table[probeIndex].state == OCCUPIED &&
                table[probeIndex].key == key) {
                return probeIndex;
            }
        }

        // Return -1 if no matching record is found
        return -1;
    }

    int probeForEmptyIndex(int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Quadratic probing
            int probeIndex = (startIndex + a * i * i + b * i) % capacity;

            // Check if the slot is available (either EMPTY or DELETED)
            if (table[probeIndex].state != OCCUPIED) {
                return probeIndex;
            }
        }

        // Return -1 if no available slot is found
        return -1;
    }

public:
    MyHashTable(int capacity, int a, int b)
        : capacity(capacity), a(a), b(b), table(capacity) {}

    int search(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Return the value if found, otherwise -1
        return occupiedIndex == -1 ? -1 : table[occupiedIndex].value;
    }

    bool insert(int key, int value) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Update the value if the key exists
        if (occupiedIndex != -1) {
            table[occupiedIndex].value = value;
            return true;
        }

        // Find an empty slot to insert the new key-value pair
        int emptyIndex = probeForEmptyIndex(startIndex);
        if (emptyIndex != -1) {
            table[emptyIndex] = Record(key, value);
            return true;
        }

        // Return false if the table is full and insertion fails
        return false;
    }

    void remove(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Mark the slot as DELETED
        if (occupiedIndex != -1) {
            table[occupiedIndex].state = DELETED;
        }
    }

    int getKeyAtIndex(int index) {
        return table[index].state == OCCUPIED ? table[index].key : -1;
    }
};
```
