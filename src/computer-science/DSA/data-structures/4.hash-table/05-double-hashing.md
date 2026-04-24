# 5. Double hashing

## Table of contents

1. [Introduction to double hashing](#introduction-to-double-hashing)
2. [Key components of double hashing](#key-components-of-double-hashing)
3. [Implementing the hash table class](#implementing-the-hash-table-class)
4. [Search operation in double hashing](#search-operation-in-double-hashing)
5. [Insert operation in double hashing](#insert-operation-in-double-hashing)
6. [Delete operation in double hashing](#delete-operation-in-double-hashing)
7. [Design a hash table with double hashing](#design-a-hash-table-with-double-hashing)

***

# Introduction to double hashing

Now that we know how a hash table is implemented using quadratic probing and some of its limitations, we look at another really popular open-addressing collision resolution scheme called double hashing. It is a slight variation of quadratic probing that has all its advantages but reduces the secondary clustering problem by having a different probe sequence for colliding keys.

Like quadratic probing, in a double hashing scheme, the internal array stores the key-value pair. The size of the internal array limits the size of the hash table, and because the array has contiguous memory, it has performance benefits due to the locality of reference.

// Diagram: Logical representation of the internal array storing the key value mappings and empty slots

The internal array can also be a dynamic array that can be resized when the hash table is full. In this course, however, we will only learn about implementation using a fixed-sized array to keep things simple.

## Handling collisions

In quadratic probing, when two keys have the same hash value (index), they follow the same probe sequence defined by the quadratic function, which leads to the secondary clustering problem.

In double hashing, the probe sequence is decided by another hash function. When there is a collision in hash values for two keys in the first hash function, the second hash function calculates the step size for probing. If the two hash functions are correctly chosen, it is very unlikely that the two colliding keys will have the same probe step size. This way, the chances of any clustering (primary or secondary) is minimized in a double hashing implementation.

// Diagram: The probe sequence is calculated using a quadratic function

Like quadratic probing, the first colliding key is stored at the correct hash index, while all other colliding keys are stored at indices in the array that represent some other hash value. However, unlike linear and quadratic probing, the chances of primary or secondary clustering are minimized since another hash function decides the distance between the colliding values.

Continuing the example of the second hash function above, let's examine the indices where the colliding keys will be stored.

// Diagram: Colliding keys have different probe sequences

Just like linear and quadratic probing, the probe in double hashing is generally performed up to N iterations, where N is the size of the array. A modulo operator makes the traversal circular to keep the result within the array's bounds. The collision resolution scheme can be summarized as follows:

> **Insert**
>
> -   **Step 1:** Find the hash value for the given key
> -   **Step 2:** Calculate step size using the second hash function
> -   **Step 3:** Iterate up to N times in the step size calculated above until an unoccupied slot is found
> -   **Step 4:** Insert the key-value pair at the slot.
>
> **Search**
>
> -   **Step 1:** Find the hash value for the given key
> -   **Step 2:** Calculate step size using the second hash function
> -   **Step 3:** Iterate up to N times in the step size calculated above until the key or an unoccupied slot is found
> -   **Step 4:** Return the value if the key is found

The double-hashing implementation is quite simple. It is just a slight variation of quadratic probing. Later in the course, we will look at the components of a hash table implemented using double hashing.

***

# Key components of double hashing

Now that we know what double hashing is, let's look at the structure of a hash table implemented using double hashing. The hash table is just an encapsulation around an array that stores key-value pairs. Different pieces have to be put together to create a hash table. Let's look at all the components and functions needed to implement a double hashing hash table.

## Record

Like quadratic probing, in a double hashing implementation of a hash table, each index in the internal array stores only one record, and collisions are handled by finding the next available free slot. For this reason, we store the key-value mapping and additional metadata to identify the type of slot(`empty`, `deleted`, or `occupied`) at each index in the array. 

A record in the double hashing implementation is a data structure that encapsulates key-value pair and status info for a slot (index) in the internal array.

// Diagram: A record in the double hashing implementation of a hash table

To implement this data structure, we create a class with key, value, and recordType as its data members. The default recordType is set as empty. The class provides a parameterized constructor to supply values during construction.

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
```

## Internal array

In the double hashing implementation of a hash table, the internal array stores all the data, so it is an array of records. Each slot in this array is either an empty or deleted record, as described by its recordType data member. We will learn later why it is important to distinguish between these two states.

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
```

## Hash function

The hash function is the heart of any hash table. It is a function that converts a given key to an index (hash value) in the internal array. The key value pair is then searched, inserted, or deleted in the internal array at that index. Any collision in hash values is resolved using the double hashing method.

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
```

## Second hash function

A hash table implemented using double hashing uses a second hash function to calculate the step size for probing when the hashed index is occupied. This second hash function is critical to implementing the hash table and has to be fine-tuned, just like the hash function. The main goal of the second hash function is to ensure that the probe sequence for two colliding keys is not the same to prevent secondary clustering. Since it is also just a hash function, it can also have collisions, but if carefully chosen, the chances of clustering are very low compared to linear and quadratic probing.

// Diagram: The second hash function calculates the step size for probing

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
```

***

# Implementing the hash table class

Now that we know the individual components of a hash table and how its operations are implemented using double hashing, let us look at the hash table class. This class encapsulates all these components and provides public functions to expose these operations. The hash table class abstracts away the implementation details of operations and the internal data structures to provide a clean and simple-to-use interface.

// Diagram: Representation of double hashing implementation of a hash table encapsulated in a class

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

    // A prime number used for double hashing
    int hashPrime;

    // The hash table implemented as a vector of Records
    vector<Record> table;

public:
    MyHashTable(int capacity, int hashPrime)
        : capacity(capacity), hashPrime(hashPrime), table(capacity) {}

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

    // A prime number used for double hashing
    private int hashPrime;

    // The hash table implemented as a list of Records
    private List<Record> table;

    public MyHashTable(int capacity, int hashPrime) {
        this.capacity = capacity;
        this.hashPrime = hashPrime;
        this.table = new ArrayList<>(capacity);
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

    // A prime number used for double hashing
    hashPrime: number;

    // The hash table implemented as an array of Records
    table: Record[];

    constructor(capacity: number, hashPrime: number) {
        this.capacity = capacity;
        this.hashPrime = hashPrime;

        // Initialize the table with EMPTY records
        this.table = Array.from(
            { length: capacity },
            () => new Record()
        );
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
    constructor(capacity, hashPrime) {

        // The total number of slots in the hash table
        this.capacity = capacity;

        // A prime number used for double hashing
        this.hashPrime = hashPrime;

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
    def __init__(self, capacity: int, hash_prime: int):

        # The total number of slots in the hash table
        self.capacity: int = capacity

        # A prime number used for double hashing
        self.hash_prime: int = hash_prime

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

    // A prime number used for double hashing
    int hashPrime;

    // The hash table implemented as a vector of Records
    vector<Record> table;

public:
    MyHashTable(int capacity, int hashPrime)
        : capacity(capacity), hashPrime(hashPrime), table(capacity) {}

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

    // A prime number used for double hashing
    private int hashPrime;

    // The hash table implemented as a list of Records
    private List<Record> table;

    public MyHashTable(int capacity, int hashPrime) {
        this.capacity = capacity;
        this.hashPrime = hashPrime;
        this.table = new ArrayList<>(capacity);
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

    // A prime number used for double hashing
    hashPrime: number;

    // The hash table implemented as an array of Records
    table: Record[];

    constructor(capacity: number, hashPrime: number) {
        this.capacity = capacity;
        this.hashPrime = hashPrime;

        // Initialize the table with EMPTY records
        this.table = Array.from(
            { length: capacity },
            () => new Record()
        );
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
    constructor(capacity, hashPrime) {

        // The total number of slots in the hash table
        this.capacity = capacity;

        // A prime number used for double hashing
        this.hashPrime = hashPrime;

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
    def __init__(self, capacity: int, hash_prime: int):

        # The total number of slots in the hash table
        self.capacity: int = capacity

        # A prime number used for double hashing
        self.hash_prime: int = hash_prime

        # The hash table implemented as a list of Records
        self.table: List[Record] = [Record() for _ in range(capacity)]

    def search(self, key: int) -> int:
      pass

    def insert(self, key: int, value: int) -> bool:
      pass

    def remove(self, key: int) -> None:
      pass
```

Let's examine what happens when the code above is executed to understand better how encapsulating all the data and operations to implement a hash table using double hashing is useful.

// Diagram: Execution of code using an instance (object) of the hash table class

Now that we know what a hash table's double hashing implementation looks like and how it functions, we will learn more about the implementation of each operation in the coming lessons.

***

# Search operation in double hashing

The search operation is one of the primary operations on a hash table and is used to retrieve the value of a key as stored in the hash table. The implementation is encapsulated in the search function and relies on the double hashing collision resolution scheme to look for a value in the internal array. Let us look at the algorithm and implementation of the search operation in a hash table implemented using double hashing.

## Algorithm

The search operation is quite simple. We only need to calculate the index (hash code) for the given key and then search for the key at the index. However, the hash table could have a collision for the given key, so we use the double hashing scheme to search for it.

Once we calculate the index (hash code) for the given key, we search the array starting from that index in increments of step size calculated by the second hash function until we either find an occupied record with the given key, hit an empty record, or finish the probe sequence.  Let us look at the different cases separately to understand how the search operation is implemented in a hash table that uses a double hashing scheme for collision resolution.

### 1\. The key is present in the table

If the key is already in the hash table, we will find it when searching for it using double hashing in the internal array. Once we find it, we return the value of this key.

// Diagram: Search for a key that is present in the hash table

> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Calculate the step size for the key using the second hash function.
> -   **Step 3:** Start searching the array from the calculated index in step size calculated by the second hash function.
> -   **Step 4:** If the key is found, return it's value.

### 2\. An empty slot is found

If the key is not present in the hash table and the probe sequence is not full, we will hit an empty record when we search for it using double hashing in the internal array. We return a flag (`-1` in this example) to indicate that the key is absent.

// Diagram: Search for a key that is not present in the hash table and the probe sequence is not full

> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Calculate the step size for the key using the second hash function.
> -   **Step 3:** Start searching the array from the calculated index in step size calculated by the second hash function.
> -   **Step 4:** If an \`EMPTY\` slot is found while probing, return \`-1\`.

### 3\. The key is not present and the probe sequence is full

This case is very unlikely, as two hash functions should provide sufficient randomness (different starting points and probe sequences) for two keys. However, there is still a slight chance that the probe sequence might be full due to stored mappings for other hashes or the full hash table. In this case, we return `-1` to indicate that the key is not in the hash table.

// Diagram: Search for a key that is not present in the hash table and the probe sequence is full

> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Calculate the step size for the key using the second hash function.
> -   **Step 3:** Start searching the array from the calculated index in step size calculated by the second hash function.
> -   **Step 4:** If the key is not found and the probe sequence is full, return \`-1\`.

## Implementation

To implement the operation, we use the hash function to get the index in the internal array and then traverse the internal array from that index using the step size calculated by the second hash function. If, during traversal, the key of an occupied record matches the given key, we return it's value. Otherwise, we return `-1` if we find an empty record, meaning we have searched through all the collisions but couldn't find the key.

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

    // A prime number used for double hashing
    int hashPrime;

    // The hash table implemented as a vector of Records
    vector<Record> table;

    // Primary hash function: Computes the index as key % capacity
    int hashFunction1(int key) { return key % capacity; }

    // Secondary hash function: Used for probing during collisions
    // Returns hashPrime - (key % hashPrime), ensuring a different step
    // size
    int hashFunction2(int key) { return hashPrime - (key % hashPrime); }

    int probeForOccupiedIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Double hashing
            int probeIndex =
                (startIndex + i * hashFunction2(key)) % capacity;

            // Check if the slot is occupied and matches the key
            if (table[probeIndex].state == OCCUPIED &&
                table[probeIndex].key == key) {
                return probeIndex;
            }

        // Return -1 if no matching record is found
        return -1;
    }

public:
    MyHashTable(int capacity, int hashPrime)
        : capacity(capacity), hashPrime(hashPrime), table(capacity) {}

// Diagram: int search(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction1(key);

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

    // A prime number used for double hashing
    private int hashPrime;

    // The hash table implemented as a list of Records
    private List<Record> table;

    // Primary hash function: Computes the index as key % capacity
    private int hashFunction1(int key) {
        return key % capacity;
    }

    // Secondary hash function: Used for probing during collisions
    // Returns hashPrime - (key % hashPrime), ensuring a different step
    // size
    private int hashFunction2(int key) {
        return hashPrime - (key % hashPrime);
    }

    private int probeForOccupiedIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Double hashing
            int probeIndex =
                (startIndex + i * hashFunction2(key)) % capacity;

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

    public MyHashTable(int capacity, int hashPrime) {
        this.capacity = capacity;
        this.hashPrime = hashPrime;
        this.table = new ArrayList<>(capacity);
        for (int i = 0; i < capacity; i++) {
            table.add(new Record());
        }

// Diagram: public int search(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction1(key);

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

    // A prime number used for double hashing
    hashPrime: number;

    // The hash table implemented as an array of Records
    table: Record[];

    constructor(capacity: number, hashPrime: number) {
        this.capacity = capacity;
        this.hashPrime = hashPrime;

        // Initialize the table with EMPTY records
        this.table = Array.from(
            { length: capacity },
            () => new Record()
        );
    }

    // Primary hash function: Computes the index as key % capacity
    hashFunction1(key: number): number {
        return key % this.capacity;
    }

    // Secondary hash function: Used for probing during collisions
    // Returns hashPrime - (key % hashPrime), ensuring a different step
    // size
    hashFunction2(key: number): number {
        return this.hashPrime - (key % this.hashPrime);
    }

    probeForOccupiedIndex(key: number, startIndex: number): number {
        for (let i = 0; i < this.capacity; i++) {

            // Double hashing
            const probeIndex =
                (startIndex + i * this.hashFunction2(key)) %
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

// Diagram: search(key: number): number {

        // Compute the initial index using the primary hash function
        const startIndex = this.hashFunction1(key);

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
    constructor(capacity, hashPrime) {
        if (hashPrime >= capacity) {
            throw new Error(
                "hashPrime must be less than the table's capacity."
            );
        }

        // The total number of slots in the hash table
        this.capacity = capacity;

        // A prime number used for double hashing
        this.hashPrime = hashPrime;

        // Initialize the table with unique empty records
        this.table = Array.from(
            { length: capacity },
            () => new Record()
        );
    }

    // Primary hash function: Computes the index as key % capacity
    hashFunction1(key) {
        return key % this.capacity;
    }

    // Secondary hash function: Used for probing during collisions
    // Returns hashPrime - (key % hashPrime), ensuring a different step
    // size
    hashFunction2(key) {
        return this.hashPrime - (key % this.hashPrime);
    }

    probeForOccupiedIndex(key, startIndex) {
        for (let i = 0; i < this.capacity; i++) {

            // Double hashing
            const probeIndex =
                (startIndex + i * this.hashFunction2(key)) %
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
        const startIndex = this.hashFunction1(key);

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
    def __init__(self, capacity: int, hash_prime: int):

        # The total number of slots in the hash table
        self.capacity: int = capacity

        # A prime number used for double hashing
        self.hash_prime: int = hash_prime

        # The hash table implemented as a list of Records
        self.table: List[Record] = [Record() for _ in range(capacity)]

    # Primary hash function: Computes the index as key % capacity
    def hash_function1(self, key: int) -> int:
        return key % self.capacity

    # Secondary hash function: Used for probing during collisions
    # Returns hash_prime - (key % hash_prime), ensuring a different step
    # size
    def hash_function2(self, key: int) -> int:
        return self.hash_prime - (key % self.hash_prime)

    def probe_for_occupied_index(
        self, key: int, start_index: int
    ) -> int:
        for i in range(self.capacity):

            # Double hashing
            probe_index = (
                start_index + i * self.hash_function2(key)
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
        start_index = self.hash_function1(key)

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

The search operation computes the provided key's hash value twice to get the base index and the step size. Both these calculations are constant-time operations. However, we must traverse the array from the calculated index to search for the key. In the best case, the record at the calculated index may have the given key, so the best-case time complexity is **constant**, **O(1)**.

In the worst case, however, the probe sequence for the given key might be full, and the key may not be in the table. We would still have to finish the entire probe to confirm this. And so, the worst-case time complexity of the search operation is **linear** **O(N)**.

// Diagram: Best case and worst case depends on the size of linked list at the calculated index

Since we do not create any new data structure that depends on the size of stored data or input and only create a fixed number of temporary variables to implement the operation, the worst-case space complexity is **constant O(1)**.

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
> **Worst Case** - The entire probe sequence is full
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Insert operation in double hashing

The insert operation is another primary operation on a hash table and is used to insert a key value mapping(Record) into the hash table. If the key is already in the hash table, the insert operation updates its value to the new value supplied. The implementation is encapsulated in the insert function and relies on the search operation to find the value first. Let us look at the algorithm and implementation of the insert operation in a hash table using double hashing.

## Algorithm

The insert operation is just an extension of the search operation. Like the search operation, we calculate the index (hash code) for the given key and search the internal array in the step size calculated by the second hash function. We need to consider three cases.

### 1\. Key is present in the table

In this case, an occupied record with the given key is found when searching the internal array using double hashing starting from the calculated index. We update the value of that record to the new value and return `true`.

// Diagram: Insert a key value mapping when the key is present in the table

> **Algorithm**
>
> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Calculate the step size for the key using the second hash function.
> -   **Step 3:** Start searching the array from the calculated index in step size calculated by the second hash function.
> -   **Step 4:** If the key is found, update the value of the stored record and return \`true\`.

### 2\. An unoccupied slot is found

In this case, the internal array is searched using double hashing, and no occupied record with the given key is found, but we hit an unoccupied (`EMPTY` or `DELETED`) slot. This means that the hash table did not store the key, so we updated the unoccupied record found with the key-value pair and marked it occupied. We return a `true` value to indicate that the insert operation succeeded.

// Diagram: Insert a key value mapping when the key is not present in the table and probe sequence is not full

> **Algorithm**
>
> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Calculate the step size for the key using the second hash function.
> -   **Step 3:** Start searching the array from the calculated index in step size calculated by the second hash function.
> -   **Step 4:** If an unoccupied (\`EMPTY\` or \`DELETED\`) slot is found, update the record with the given key-value pair, mark it occupied, and return \`true\`.

### 3\. The probe sequence is full

This case is unlikely, as two hash functions should provide sufficient randomness (different starting points and probe sequences) for two keys. However, there is still a slight chance that the probe sequence might be full due to stored mappings for other hashes or the full hash table.

In this case, the entire probe sequence starting from the hashed index is finished, but no record of the given key is found. We return `false` to indicate that the insert operation failed.

// Diagram: Insert a key value mapping when the key is not present and the probe sequence is full

> **Algorithm**
>
> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Calculate the step size for the key using the second hash function.
> -   **Step 3:** Start searching the array from the calculated index in step size calculated by the second hash function.
> -   **Step 4:** If no unoccupied slot is found, return \`false\`.

## Implementation

To implement the operation, we use the hash function to get the index in the internal array and then traverse the internal array from that index using the step size calculated by the second hash function. If, during traversal, the key of an occupied record matches the given key, we update its value. If an empty record is found, we update it with the given key-value pair. Finally, we return a boolean value to indicate the operation's success.

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

    // A prime number used for double hashing
    int hashPrime;

    // The hash table implemented as a vector of Records
    vector<Record> table;

    // Primary hash function: Computes the index as key % capacity
    int hashFunction1(int key) { return key % capacity; }

    // Secondary hash function: Used for probing during collisions
    // Returns hashPrime - (key % hashPrime), ensuring a different step
    // size
    int hashFunction2(int key) { return hashPrime - (key % hashPrime); }

    int probeForOccupiedIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Double hashing
            int probeIndex =
                (startIndex + i * hashFunction2(key)) % capacity;

            // Check if the slot is occupied and matches the key
            if (table[probeIndex].state == OCCUPIED &&
                table[probeIndex].key == key) {
                return probeIndex;
            }

        // Return -1 if no matching record is found
        return -1;
    }

    int probeForEmptyIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Double hashing
            int probeIndex =
                (startIndex + i * hashFunction2(key)) % capacity;

            // Check if the slot is available (either EMPTY or DELETED)
            if (table[probeIndex].state != OCCUPIED) {
                return probeIndex;
            }

        // Return -1 if no available slot is found
        return -1;
    }

public:
    MyHashTable(int capacity, int hashPrime)
        : capacity(capacity), hashPrime(hashPrime), table(capacity) {}

// Diagram: int search(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction1(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Return the value if found, otherwise -1
        return occupiedIndex == -1 ? -1 : table[occupiedIndex].value;
    }

// Diagram: bool insert(int key, int value) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction1(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Update the value if the key exists
        if (occupiedIndex != -1) {
            table[occupiedIndex].value = value;
            return true;
        }

        // Find an empty slot to insert the new key-value pair
        int emptyIndex = probeForEmptyIndex(key, startIndex);
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

    // A prime number used for double hashing
    private int hashPrime;

    // The hash table implemented as a list of Records
    private List<Record> table;

    // Primary hash function: Computes the index as key % capacity
    private int hashFunction1(int key) {
        return key % capacity;
    }

    // Secondary hash function: Used for probing during collisions
    // Returns hashPrime - (key % hashPrime), ensuring a different step
    // size
    private int hashFunction2(int key) {
        return hashPrime - (key % hashPrime);
    }

    private int probeForOccupiedIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Double hashing
            int probeIndex =
                (startIndex + i * hashFunction2(key)) % capacity;

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

    private int probeForEmptyIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Double hashing
            int probeIndex =
                (startIndex + i * hashFunction2(key)) % capacity;

            // Check if the slot is available (either EMPTY or DELETED)
            if (table.get(probeIndex).state != RecordType.OCCUPIED) {
                return probeIndex;
            }

        // Return -1 if no available slot is found
        return -1;
    }

    public MyHashTable(int capacity, int hashPrime) {
        this.capacity = capacity;
        this.hashPrime = hashPrime;
        this.table = new ArrayList<>(capacity);
        for (int i = 0; i < capacity; i++) {
            table.add(new Record());
        }

// Diagram: public int search(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction1(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Return the value if found, otherwise -1
        return occupiedIndex == -1 ? -1 : table.get(occupiedIndex).value;
    }

// Diagram: public boolean insert(int key, int value) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction1(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Update the value if the key exists
        if (occupiedIndex != -1) {
            table.get(occupiedIndex).value = value;
            return true;
        }

        // Find an empty slot to insert the new key-value pair
        int emptyIndex = probeForEmptyIndex(key, startIndex);
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

    // A prime number used for double hashing
    hashPrime: number;

    // The hash table implemented as an array of Records
    table: Record[];

    constructor(capacity: number, hashPrime: number) {
        this.capacity = capacity;
        this.hashPrime = hashPrime;

        // Initialize the table with EMPTY records
        this.table = Array.from(
            { length: capacity },
            () => new Record()
        );
    }

    // Primary hash function: Computes the index as key % capacity
    hashFunction1(key: number): number {
        return key % this.capacity;
    }

    // Secondary hash function: Used for probing during collisions
    // Returns hashPrime - (key % hashPrime), ensuring a different step
    // size
    hashFunction2(key: number): number {
        return this.hashPrime - (key % this.hashPrime);
    }

    probeForOccupiedIndex(key: number, startIndex: number): number {
        for (let i = 0; i < this.capacity; i++) {

            // Double hashing
            const probeIndex =
                (startIndex + i * this.hashFunction2(key)) %
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

    probeForEmptyIndex(key: number, startIndex: number): number {
        for (let i = 0; i < this.capacity; i++) {

            // Double hashing
            const probeIndex =
                (startIndex + i * this.hashFunction2(key)) %
                this.capacity;

            // Check if the slot is available (either EMPTY or DELETED)
            if (this.table[probeIndex].state !== RecordType.OCCUPIED) {
                return probeIndex;
            }

        // Return -1 if no available slot is found
        return -1;
    }

// Diagram: search(key: number): number {

        // Compute the initial index using the primary hash function
        const startIndex = this.hashFunction1(key);

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

// Diagram: insert(key: number, value: number): boolean {

        // Compute the initial index using the primary hash function
        const startIndex = this.hashFunction1(key);

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
        const emptyIndex = this.probeForEmptyIndex(key, startIndex);
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
    constructor(capacity, hashPrime) {
        if (hashPrime >= capacity) {
            throw new Error(
                "hashPrime must be less than the table's capacity."
            );
        }

        // The total number of slots in the hash table
        this.capacity = capacity;

        // A prime number used for double hashing
        this.hashPrime = hashPrime;

        // Initialize the table with unique empty records
        this.table = Array.from(
            { length: capacity },
            () => new Record()
        );
    }

    // Primary hash function: Computes the index as key % capacity
    hashFunction1(key) {
        return key % this.capacity;
    }

    // Secondary hash function: Used for probing during collisions
    // Returns hashPrime - (key % hashPrime), ensuring a different step
    // size
    hashFunction2(key) {
        return this.hashPrime - (key % this.hashPrime);
    }

    probeForOccupiedIndex(key, startIndex) {
        for (let i = 0; i < this.capacity; i++) {

            // Double hashing
            const probeIndex =
                (startIndex + i * this.hashFunction2(key)) %
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

    probeForEmptyIndex(key, startIndex) {
        for (let i = 0; i < this.capacity; i++) {

            // Double hashing
            const probeIndex =
                (startIndex + i * this.hashFunction2(key)) %
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
        const startIndex = this.hashFunction1(key);

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
        const startIndex = this.hashFunction1(key);

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
        const emptyIndex = this.probeForEmptyIndex(key, startIndex);
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
    def __init__(self, capacity: int, hash_prime: int):

        # The total number of slots in the hash table
        self.capacity: int = capacity

        # A prime number used for double hashing
        self.hash_prime: int = hash_prime

        # The hash table implemented as a list of Records
        self.table: List[Record] = [Record() for _ in range(capacity)]

    # Primary hash function: Computes the index as key % capacity
    def hash_function1(self, key: int) -> int:
        return key % self.capacity

    # Secondary hash function: Used for probing during collisions
    # Returns hash_prime - (key % hash_prime), ensuring a different step
    # size
    def hash_function2(self, key: int) -> int:
        return self.hash_prime - (key % self.hash_prime)

    def probe_for_occupied_index(
        self, key: int, start_index: int
    ) -> int:
        for i in range(self.capacity):

            # Double hashing
            probe_index = (
                start_index + i * self.hash_function2(key)
            ) % self.capacity

            # Check if the slot is occupied and matches the key
            if (
                self.table[probe_index].state == RecordType.OCCUPIED
                and self.table[probe_index].key == key
            ):
                return probe_index

        # Return -1 if no matching record is found
        return -1

    def probe_for_empty_index(self, key: int, start_index: int) -> int:
        for i in range(self.capacity):

            # Double hashing
            probe_index = (
                start_index + i * self.hash_function2(key)
            ) % self.capacity

            # Check if the slot is available (either EMPTY or DELETED)
            if self.table[probe_index].state != RecordType.OCCUPIED:
                return probe_index

        # Return -1 if no available slot is found
        return -1

    def search(self, key: int) -> int:

        # Compute the initial index using the primary hash function
        start_index = self.hash_function1(key)

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
        start_index = self.hash_function1(key)

        # Find the occupied index for the key
        occupied_index = self.probe_for_occupied_index(key, start_index)

        # Update the value if the key exists
        if occupied_index != -1:
            self.table[occupied_index].value = value
            return True

        # Find an empty slot to insert the new key-value pair
        empty_index = self.probe_for_empty_index(key, start_index)
        if empty_index != -1:
            self.table[empty_index] = Record(key, value)
            return True

        # Return False if the table is full and insertion fails
        return False
```

## Complexity analysis

The insert operation computes the provided key's hash value twice to get the base index and the step size. Both these calculations are constant time operations. However, we must traverse the array from the calculated index to search for the key. In the best case, the record at the calculated index may have the given key, so the best-case time complexity is constant, **O(1)**.

In the worst case, however, the probe sequence for the given key might be full, and the key may not be in the table. We would still have to finish the entire probe to confirm this. And so, the worst-case time complexity of the search operation is **linear** **O(N)**.

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
> **Worst Case** - The entire probe sequence is full
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Delete operation in double hashing

The delete operation is another primary operation on a hash table. It deletes a key-value mapping from the hash table. Nothing is done if the key is not in the hash table. The implementation is encapsulated in the delete function, which uses double hashing to search for the key in the internal array. Let us look at the algorithm and implementation of the delete operation in a hash table using double hashing.

## Algorithm

The delete operation is also an extension of the search operation. Like the search operation, we calculate the index (hash code) for the given key and search the internal array for a record with the given key starting from the calculated index. We may need to consider three cases.

### 1\. Key is present in the table

In this case, double hashing finds the key in an occupied record when searching the internal array. We update the record to mark it `DELETED`. This deleted record can be reused when inserting a new key-value pair in the hash table. The search operation only terminates at an empty record, so it skips any deleted records.

// Diagram: Delete a key that is present in the table

> **Algorithm**
>
> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Calculate the step size for the key using the second hash function.
> -   **Step 3:** Start searching the array from the calculated index in step size calculated by the second hash function.
> -   **Step 4:** If the key is found, mark it \`DELETED\`.

### 2\. An empty slot is found

Suppose the key is not found in any occupied record when searching the internal array using double hashing from the calculated index. In that case, the delete operation becomes a no-op (nothing is done). This can happen if we reach an empty record before finding the key.

// Diagram: Delete a key that is not present in the table

> **Algorithm**
>
> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Calculate the step size for the key using the second hash function.
> -   **Step 3:** Start searching the array from the calculated index in step size calculated by the second hash function.
> -   **Step 4:** If an empty slot is reached before finding the key, terminate the operation (no-op).

### 3\. The probe sequence is full

This case is unlikely, as two hash functions should provide sufficient randomness (different starting points and probe sequences) for two keys. However, there is still a slight chance that the probe sequence might be full due to stored mappings for other hashes or the full hash table.

Nothing is done if the entire probe sequence starting from the hashed index is finished but no record with the given key is found. In this case, the delete operation becomes a no-op (nothing is done).

// Diagram: Delete a key that is not present and the probe sequence is full

> **Algorithm**
>
> -   **Step 1:** Calculate the index(hash code) for the given key.
> -   **Step 2:** Calculate the step size for the key using the second hash function.
> -   **Step 3:** Start searching the array from the calculated index in step size calculated by the second hash function.
> -   **Step 4:** If the entire probe sequence is traversed without finding the key or an empty slot, terminate the operation (no-op).

## Implementation

To implement the operation, we use the hash function to get the index in the internal array and then traverse the internal array from that index using the step size calculated by the second hash function. If, during traversal, the key of an occupied record matches the given key, we mark it deleted. Otherwise, this operation is a no-op.

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

    // A prime number used for double hashing
    int hashPrime;

    // The hash table implemented as a vector of Records
    vector<Record> table;

    // Primary hash function: Computes the index as key % capacity
    int hashFunction1(int key) { return key % capacity; }

    // Secondary hash function: Used for probing during collisions
    // Returns hashPrime - (key % hashPrime), ensuring a different step
    // size
    int hashFunction2(int key) { return hashPrime - (key % hashPrime); }

    int probeForOccupiedIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Double hashing
            int probeIndex =
                (startIndex + i * hashFunction2(key)) % capacity;

            // Check if the slot is occupied and matches the key
            if (table[probeIndex].state == OCCUPIED &&
                table[probeIndex].key == key) {
                return probeIndex;
            }

        // Return -1 if no matching record is found
        return -1;
    }

    int probeForEmptyIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Double hashing
            int probeIndex =
                (startIndex + i * hashFunction2(key)) % capacity;

            // Check if the slot is available (either EMPTY or DELETED)
            if (table[probeIndex].state != OCCUPIED) {
                return probeIndex;
            }

        // Return -1 if no available slot is found
        return -1;
    }

public:
    MyHashTable(int capacity, int hashPrime)
        : capacity(capacity), hashPrime(hashPrime), table(capacity) {}

// Diagram: int search(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction1(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Return the value if found, otherwise -1
        return occupiedIndex == -1 ? -1 : table[occupiedIndex].value;
    }

// Diagram: bool insert(int key, int value) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction1(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Update the value if the key exists
        if (occupiedIndex != -1) {
            table[occupiedIndex].value = value;
            return true;
        }

        // Find an empty slot to insert the new key-value pair
        int emptyIndex = probeForEmptyIndex(key, startIndex);
        if (emptyIndex != -1) {
            table[emptyIndex] = Record(key, value);
            return true;
        }

        // Return false if the table is full and insertion fails
        return false;
    }

// Diagram: void remove(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction1(key);

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

    // A prime number used for double hashing
    private int hashPrime;

    // The hash table implemented as a list of Records
    private List<Record> table;

    // Primary hash function: Computes the index as key % capacity
    private int hashFunction1(int key) {
        return key % capacity;
    }

    // Secondary hash function: Used for probing during collisions
    // Returns hashPrime - (key % hashPrime), ensuring a different step
    // size
    private int hashFunction2(int key) {
        return hashPrime - (key % hashPrime);
    }

    private int probeForOccupiedIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Double hashing
            int probeIndex =
                (startIndex + i * hashFunction2(key)) % capacity;

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

    private int probeForEmptyIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Double hashing
            int probeIndex =
                (startIndex + i * hashFunction2(key)) % capacity;

            // Check if the slot is available (either EMPTY or DELETED)
            if (table.get(probeIndex).state != RecordType.OCCUPIED) {
                return probeIndex;
            }

        // Return -1 if no available slot is found
        return -1;
    }

    public MyHashTable(int capacity, int hashPrime) {
        this.capacity = capacity;
        this.hashPrime = hashPrime;
        this.table = new ArrayList<>(capacity);
        for (int i = 0; i < capacity; i++) {
            table.add(new Record());
        }

// Diagram: public int search(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction1(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Return the value if found, otherwise -1
        return occupiedIndex == -1 ? -1 : table.get(occupiedIndex).value;
    }

// Diagram: public boolean insert(int key, int value) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction1(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Update the value if the key exists
        if (occupiedIndex != -1) {
            table.get(occupiedIndex).value = value;
            return true;
        }

        // Find an empty slot to insert the new key-value pair
        int emptyIndex = probeForEmptyIndex(key, startIndex);
        if (emptyIndex != -1) {
            table.set(emptyIndex, new Record(key, value));
            return true;
        }

        // Return false if the table is full and insertion fails
        return false;
    }

// Diagram: public void remove(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction1(key);

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

    // A prime number used for double hashing
    hashPrime: number;

    // The hash table implemented as an array of Records
    table: Record[];

    constructor(capacity: number, hashPrime: number) {
        this.capacity = capacity;
        this.hashPrime = hashPrime;

        // Initialize the table with EMPTY records
        this.table = Array.from(
            { length: capacity },
            () => new Record()
        );
    }

    // Primary hash function: Computes the index as key % capacity
    hashFunction1(key: number): number {
        return key % this.capacity;
    }

    // Secondary hash function: Used for probing during collisions
    // Returns hashPrime - (key % hashPrime), ensuring a different step
    // size
    hashFunction2(key: number): number {
        return this.hashPrime - (key % this.hashPrime);
    }

    probeForOccupiedIndex(key: number, startIndex: number): number {
        for (let i = 0; i < this.capacity; i++) {

            // Double hashing
            const probeIndex =
                (startIndex + i * this.hashFunction2(key)) %
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

    probeForEmptyIndex(key: number, startIndex: number): number {
        for (let i = 0; i < this.capacity; i++) {

            // Double hashing
            const probeIndex =
                (startIndex + i * this.hashFunction2(key)) %
                this.capacity;

            // Check if the slot is available (either EMPTY or DELETED)
            if (this.table[probeIndex].state !== RecordType.OCCUPIED) {
                return probeIndex;
            }

        // Return -1 if no available slot is found
        return -1;
    }

// Diagram: search(key: number): number {

        // Compute the initial index using the primary hash function
        const startIndex = this.hashFunction1(key);

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

// Diagram: insert(key: number, value: number): boolean {

        // Compute the initial index using the primary hash function
        const startIndex = this.hashFunction1(key);

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
        const emptyIndex = this.probeForEmptyIndex(key, startIndex);
        if (emptyIndex !== -1) {
            this.table[emptyIndex] = new Record(key, value);
            return true;
        }

        // Return false if the table is full and insertion fails
        return false;
    }

// Diagram: remove(key: number): void {

        // Compute the initial index using the primary hash function
        const startIndex = this.hashFunction1(key);

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
    constructor(capacity, hashPrime) {
        if (hashPrime >= capacity) {
            throw new Error(
                "hashPrime must be less than the table's capacity."
            );
        }

        // The total number of slots in the hash table
        this.capacity = capacity;

        // A prime number used for double hashing
        this.hashPrime = hashPrime;

        // Initialize the table with unique empty records
        this.table = Array.from(
            { length: capacity },
            () => new Record()
        );
    }

    // Primary hash function: Computes the index as key % capacity
    hashFunction1(key) {
        return key % this.capacity;
    }

    // Secondary hash function: Used for probing during collisions
    // Returns hashPrime - (key % hashPrime), ensuring a different step
    // size
    hashFunction2(key) {
        return this.hashPrime - (key % this.hashPrime);
    }

    probeForOccupiedIndex(key, startIndex) {
        for (let i = 0; i < this.capacity; i++) {

            // Double hashing
            const probeIndex =
                (startIndex + i * this.hashFunction2(key)) %
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

    probeForEmptyIndex(key, startIndex) {
        for (let i = 0; i < this.capacity; i++) {

            // Double hashing
            const probeIndex =
                (startIndex + i * this.hashFunction2(key)) %
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
        const startIndex = this.hashFunction1(key);

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
        const startIndex = this.hashFunction1(key);

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
        const emptyIndex = this.probeForEmptyIndex(key, startIndex);
        if (emptyIndex !== -1) {
            this.table[emptyIndex] = new Record(key, value);
            return true;
        }

        // Return false if the table is full and insertion fails
        return false;
    }

// Diagram: remove(key) {

        // Compute the initial index using the primary hash function
        const startIndex = this.hashFunction1(key);

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
    def __init__(self, capacity: int, hash_prime: int):

        # The total number of slots in the hash table
        self.capacity: int = capacity

        # A prime number used for double hashing
        self.hash_prime: int = hash_prime

        # The hash table implemented as a list of Records
        self.table: List[Record] = [Record() for _ in range(capacity)]

    # Primary hash function: Computes the index as key % capacity
    def hash_function1(self, key: int) -> int:
        return key % self.capacity

    # Secondary hash function: Used for probing during collisions
    # Returns hash_prime - (key % hash_prime), ensuring a different step
    # size
    def hash_function2(self, key: int) -> int:
        return self.hash_prime - (key % self.hash_prime)

    def probe_for_occupied_index(
        self, key: int, start_index: int
    ) -> int:
        for i in range(self.capacity):

            # Double hashing
            probe_index = (
                start_index + i * self.hash_function2(key)
            ) % self.capacity

            # Check if the slot is occupied and matches the key
            if (
                self.table[probe_index].state == RecordType.OCCUPIED
                and self.table[probe_index].key == key
            ):
                return probe_index

        # Return -1 if no matching record is found
        return -1

    def probe_for_empty_index(self, key: int, start_index: int) -> int:
        for i in range(self.capacity):

            # Double hashing
            probe_index = (
                start_index + i * self.hash_function2(key)
            ) % self.capacity

            # Check if the slot is available (either EMPTY or DELETED)
            if self.table[probe_index].state != RecordType.OCCUPIED:
                return probe_index

        # Return -1 if no available slot is found
        return -1

    def search(self, key: int) -> int:

        # Compute the initial index using the primary hash function
        start_index = self.hash_function1(key)

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
        start_index = self.hash_function1(key)

        # Find the occupied index for the key
        occupied_index = self.probe_for_occupied_index(key, start_index)

        # Update the value if the key exists
        if occupied_index != -1:
            self.table[occupied_index].value = value
            return True

        # Find an empty slot to insert the new key-value pair
        empty_index = self.probe_for_empty_index(key, start_index)
        if empty_index != -1:
            self.table[empty_index] = Record(key, value)
            return True

        # Return False if the table is full and insertion fails
        return False

    def remove(self, key: int) -> None:

        # Compute the initial index using the primary hash function
        start_index = self.hash_function1(key)

        # Find the occupied index for the key
        occupied_index = self.probe_for_occupied_index(key, start_index)

        # Mark the slot as DELETED
        if occupied_index != -1:
            self.table[occupied_index].state = RecordType.DELETED
```

## Complexity analysis

The delete operation computes the provided key's hash value twice to get the base index and the step size. Both these calculations are constant-time operations. However, we must traverse the array from the calculated index to search for the key. In the best case, the record at the calculated index may have the given key, so the best-case time complexity is **constant**, **O(1)**.

In the worst case, however, the probe sequence for the given key might be full, and the key may not be in the table. We would still have to finish the entire probe to confirm this. And so, the worst-case time complexity of the delete operation is **linear** **O(N)**.

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

# Design a hash table with double hashing

## Problem Statement

Given the skeleton of a **HashTable** class, complete this class by implementing all the hash table operations below.

> -   **MyHashTable(int capacity, int hashPrime)** - Initializes the hash table object with the given capacity for the internal data structure and stores the hasPrime to use in the second hash function.
> -   **search(int key)** - Returns the value mapped to the given key, or \`-1\` if the key is absent.
> -   **insert(int key, int value)** - Inserts a (key, value) pair into the hash table. If the key already exists, it updates the value. Returns \`true\` if the operation is successful; otherwise, returns \`false\`.
> -   **remove(int key)** - Removes the key and its corresponding value if the mapping for the key exists in the key.
> -   **getKeyAtIndex(int index)** - Returns the key mapped to the given index in the internal data structure.

// Diagram: You must abide by the following constraints

// Diagram: 1\. You must implement this without using any built-in hash table libraries

2. **Double hashing** must be used as a collision resolution strategy.

3\. The first hash function should compute a key's index by taking the key's modulo with the hash table's capacity, i.e., `index = key % capacity`.

4\. You will receive the `hashPrime` in the input to use in the second hash function.

> The input should adhere to the following rules:
>
> 1.  The input array contain two arrays of the same size.
> 2.  The first array should contain the list of operations, while the second should contain the corresponding operands for those operations.
> 3.  The first index in the first array should contain **MyHashTable**, and the first index in the second array should contain two positive integers denoting the capacity of the hash table and the values of \`hashPrime\`, respectively. These values are used to initialise the hash table.
> 4.  For each index in the first array that contains the **insert** operation, the corresponding index in the second array should contain a (key, value) pair to be inserted.
> 5.  For each index in the first array that contains **search** or **remove** operations, the corresponding index in the second array should contain the key for which that operation will be performed.
> 6.  For each index in the first array that contains the **getKeyAtIndex** operation, the corresponding index in the second array should contain the index for which the operation will be performed.
>
> **Example:**
>
> -   **Input:** \[MyHashTable, insert, insert, search, insert, search, insert, search, search, getKeyAtIndex\] \[\[3, 2\], \[1, 2\], \[2, 4\], \[1\], \[1, 3\], \[1\], \[2, 5\], \[2\], \[3\], \[0\]\]
>
> -   **Output:** \[null, true, true, 2, true, 3, true, 5, -1, -1\]
>
> **Explanation:**
>
> **Operation:** MyHashTable myHashTable = new MyHashTable(3, 2) **Result:** Initializes an empty \`MyHashTable\` with a capacity of 3 and stores the \`hashPrime = 2\`.
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

    // A prime number used for double hashing
    int hashPrime;

    // The hash table implemented as a vector of Records
    vector<Record> table;

    // Primary hash function: Computes the index as key % capacity
    int hashFunction1(int key) { return key % capacity; }

    // Secondary hash function: Used for probing during collisions
    // Returns hashPrime - (key % hashPrime), ensuring a different step
    // size
    int hashFunction2(int key) { return hashPrime - (key % hashPrime); }

    int probeForOccupiedIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Double hashing
            int probeIndex =
                (startIndex + i * hashFunction2(key)) % capacity;

            // Check if the slot is occupied and matches the key
            if (table[probeIndex].state == OCCUPIED &&
                table[probeIndex].key == key) {
                return probeIndex;
            }
        }

        // Return -1 if no matching record is found
        return -1;
    }

    int probeForEmptyIndex(int key, int startIndex) {
        for (int i = 0; i < capacity; ++i) {

            // Double hashing
            int probeIndex =
                (startIndex + i * hashFunction2(key)) % capacity;

            // Check if the slot is available (either EMPTY or DELETED)
            if (table[probeIndex].state != OCCUPIED) {
                return probeIndex;
            }
        }

        // Return -1 if no available slot is found
        return -1;
    }

public:
    MyHashTable(int capacity, int hashPrime)
        : capacity(capacity), hashPrime(hashPrime), table(capacity) {}

    int search(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction1(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Return the value if found, otherwise -1
        return occupiedIndex == -1 ? -1 : table[occupiedIndex].value;
    }

    bool insert(int key, int value) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction1(key);

        // Find the occupied index for the key
        int occupiedIndex = probeForOccupiedIndex(key, startIndex);

        // Update the value if the key exists
        if (occupiedIndex != -1) {
            table[occupiedIndex].value = value;
            return true;
        }

        // Find an empty slot to insert the new key-value pair
        int emptyIndex = probeForEmptyIndex(key, startIndex);
        if (emptyIndex != -1) {
            table[emptyIndex] = Record(key, value);
            return true;
        }

        // Return false if the table is full and insertion fails
        return false;
    }

    void remove(int key) {

        // Compute the initial index using the primary hash function
        int startIndex = hashFunction1(key);

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
