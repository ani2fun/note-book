# 1. Introduction to hash tables

## Table of contents

1. [Understanding the problem](#understanding-the-problem)
2. [Exploring a possible solution](#exploring-a-possible-solution)
3. [Defining a hash function](#defining-a-hash-function)
4. [Properties of a good hash function](#properties-of-a-good-hash-function)
5. [Examples of hash functions](#examples-of-hash-functions)
6. [Internal mechanics of a hash table](#internal-mechanics-of-a-hash-table)
7. [Overview of supported operations](#overview-of-supported-operations)

***

# Understanding the problem

To better understand a hash table, let us first look at some common problems programmers face when designing software systems. When writing a program, we often need to **map** different data types together, such as the roll number of all students in a class. We need some data structure that stores the mapping between data of different types. The names of all students are strings, while their roll numbers might be positive integer values. 

// Diagram: Storing mappings between strings and integers

One way to store these mappings is in two separate arrays at the same indices.

// Diagram: Storing mapping between names and roll number in separate arrays

This is an easy way to store data, but what if we want to retrieve the roll number of a student by their name? If the data is stored in arrays, we will have to traverse the entire `names` array to search for a student's name to get their roll number. 

// Diagram: Searching for the roll number of a student by their name

This will solve the problem at hand. However, the operation does a linear scan of the entire array, which will be inefficient if many students are in a class. What if we want to store the roll numbers of all the students in all classes of all the schools in a city? This is not an efficient way to store data.

## Limitations of storing mappings in two arrays

It is quite intuitive to store the mapping between a student's name (key) and roll number (value) in two separate arrays. However, this approach has some serious limitations.

> -   **Bad performance:** Searching for data stored in an array has linear **O(N)** worst case time complexity.
> -   **Fixed size:** The size of an array is fixed at the time of creation and cannot be expanded/reduced.

We may be able to use dynamic arrays instead of fixed-sized arrays to get over the fixed-size limitation, but it will still have the same performance. What if we had a data structure that could solve the above problem most efficiently and at scale?

***

# Exploring a possible solution

We know that storing key-value mappings in two separate arrays has limitations and results in sub-optimal solutions, so we can look at a data structure explicitly designed to solve this problem. A hash table efficiently stores mapping between data and provides fast data access.

## Real life example

A real-life example of such a data structure is a phone book directory with the phone numbers of all the residents in a city. The phone book lists the names in alphabetical order. Anyone can quickly jump to the page with a person's phone number just by looking at the index instead of linearly scanning the entire phonebook.

This fast access is possible because the index translates the name to the page number(intermediate value), where the phone number is stored super fast. Once we know the name, we apply a few steps to find the page number and then look at that page for the phone number.

// Diagram: Finding the phone number in a phone book

## Hash table

A hash table is a data structure that stores the mapping between a key and value and provides constant **O(1)** search, insert, and delete operations in most cases. Like the real-world phone book, a hash table uses a hash function to translate the key to an intermediate value (hash value). This intermediate value can be used to access the stored data quickly. The data is generally stored in an array, and the intermediate value (hash value) is an array index, making constant **O(1)** time access possible. Logically, it looks like a table that stores mappings as key-value pairs in a row.

// Diagram: A hash table stores mapping between a key and value

## Logical representation

A hash table is logically represented as a simple table where each row stores a mapping between a key and a value. This representation is easy to understand and use when solving a problem. We will use this representation throughout the course to represent a hash table.

// Diagram: Logical representation of a hash table

***

# Defining a hash function

A hash function is the center of any solution to the mapping problem we saw earlier. Understanding a hash function is very important before exploring the internal workings of a hash table.

## Mathematical function

In pure mathematics, a function from set K to V is defined as the logic that assigns exactly one value in V to every element in K. The set K is the **domain**, and V is the function's **codomain**. In simple terms, a mathematical function is essentially something that maps values from a set K to a set V. These sets can have data of any type (integers, strings, objects, etc.).

// Diagram: A function maps values between its domain and codomain sets

To understand mathematical functions better, let us look at some simple examples. Most of us are familiar with numerical mathematical functions, so we will only look at 

// Diagram: Examples of some mathematical functions

It is important to note here that mathematical functions place no restrictions on the size of their domain and codomain sets so that both these sets can be of any arbitrary size (infinite or fixed)

## Hash function

Now that we know a mathematical function let us look at hash functions. A hash function is a mathematical function that can map elements from an arbitrary (infinite or fixed) set to a finite site. Any mathematical function with a fixed-size codomain set (hash value) can be called a hash function. The domain set (keys) for the hash function can be of a fixed or infinite size.

// Diagram: Hash functions are just a subset of all mathematical functions

Not all mathematical functions are hash functions, but all hash functions are mathematical functions. The output from a hash function (elements of the codomain set) is called hash values, sometimes also called hash codes, digests, or simply hashes. Let us revisit our example mathematical functions from before and understand what functions can be classified as hash functions or otherwise.

// Diagram: Not all mathematical functions are hash functions

## Collision

A hash function's domain set (keys) can be potentially infinite, but the co-domain set (hash values) has a fixed size. It should be easy to see that no matter how good a hash function is, mapping a potentially infinite number of values to values in a finite size will result in a collision.

Collision

> When two different elements in a hash function's domain set(keys) map to the same value in the codomain set (hash value), it is said to be a collision.

// Diagram: When to different inputs have the same hash value, it is called a collision

The primary purpose of a hash function is to map elements in a large (potentially infinite) set to a fixed-sized set, so collision is inevitable. However, we can choose the hash function carefully to reduce the chances of collision. A good hash function has a low probability for collision and is fast.

***

# Properties of a good hash function

Now that we know what is a hash function, it should be clear that not all hash functions are the same. A good hash function for a specific type of input data (domain set) may perform poorly for other data types. How do we decide if a hash function is good or bad? A few properties of a hash function decide if it is good or bad. Some of them are given below.

## Uniformity

A good hash function maps elements in the domain set(keys) to elements in the co-domain set(hash values) as uniformly as possible. Some hash functions, like the mod function, are uniform. In a perfectly uniform function, every element in the co-domain set should be mapped to the same number of elements in the domain set.

// Diagram: The keys are mapped to values uniformly

## Deterministic

A hash function should be deterministic. This means that any element in the domain set(keys) should be mapped to exactly one element in the co-domain set(hash values) and always be the same. Essentially, this means that for a given input(key), the hash function should always result in the same hash value.

// Diagram: A key should always be mapped to the same hash value

## Efficient

A hash function maps input data (keys) to a fixed-sized set of values(hash value). The primary purpose of a hash function is to store and retire data items using this computed hash value, so the hash value computation should be efficient. The hash function should be efficient and fast and have a negligible computational cost.

// Diagram: The hash function should be efficient

***

# Examples of hash functions

Now that we know that a hash function is just a subset of all mathematical functions, it is fairly easy to see that there can be an infinite number of hash functions, and it is not too difficult for anyone to create one. Let us look at some easy examples of hash functions to understand them better.

## Identity hash function

For cases where the domain set has a fixed size, the elements in the set can be used as the hashed values. The domain and codomain sets are the same for an identity hash function, and every value is mapped to it. The input(key) can be treated as the hash value.

// Diagram: Identity hash function

## Trivial hash functions

For cases where the domain set has a fixed size but cannot use the identity hash function, we can apply some trivial techniques to use the keys as hash values. For example, if the domain set has values between `[1000, 2000]` but we want the codomain set (hash values) only to have a value between `[1, 99]`, we can extract the middle two digits of the input and use them as the has values. 

// Diagram: A trivial hash function

## Division hash function

If both the domain(key) and codomain (hash codes) are a set of integers, the division hash function is the simplest group of hash functions to think of. To fix the size of the codomain set (hash values) to a size, say, Y, we can divide the elements from the domain set (keys) by Y and treat the remainder as the hash value. This way, the codomain set (hash values) will have only a fixed size (0 .. Y-1).

// Diagram: Division hash functions for integer keys

## Mid square hash function

A mid square hash function is also good if the domain(key) and codomain (hash codes) are a set of integers. We square the key and take the middle **r** digits of the key. When we square an integer, all its digits contribute to the resultant squared integer, not just the first or last few digits (as in the division method). Since we only take r digits, the resultant hash value will always be between `[0 to base^r)`.

// Diagram: Mid square hash functions for integer keys

## Takeaway

From the examples above, it should be easy to figure out that there can be many different types of hash functions, and it is quite easy to create one. However, the choice of a hash function depends on the use case. For example, if the domain set is infinite, we cannot use an identity function, or if the domain set size is small, it's just easier to use an identity or trivial hash function.

***

# Internal mechanics of a hash table

A hash table is generally an encapsulation around an array, and the basic principle on which it works is quite simple. We know that accessing a data item in an array is a constant time **O(1)** operation if we know the index where the data item is stored.

We can leverage an array's fast random-access property to map a key and value together. We can store the original key-value pair at that index by using a hash function that converts the given key into an array's index(hash value). A good hash function guarantees that a given key will always result in the same index, and the computation is a constant-time operation. Once we fix the index for a key, the data can be accessed in constant time in the array.

// Diagram: Working of a hash table

There are many different implementations of a hash table, each generally tailored to a specific use case. However, the underlying basic components remain the same. Let us look at the major components that make up a hash table.

## Internal array

A hash table is just an encapsulation around an array. This array stores the actual data (key and value). This internal array generally has a fixed size, but more complex implementations can also use a dynamic array. The internal array's size also decides which hash function to use, as the hash function ultimately calculates an index in this array. The internal array's size depends on the distribution of keys and use case, and it should be big enough to prevent too many collisions.

**Why do we store both key and value in the internal array?**

We store both key and value as there could be a collision, and multiple keys might be mapped to the same hash value. When searching for a key, we iterate through all the colliding keys and search for the given key by matching it with the stored key.

// Diagram: The internal array stores the key value pair

## Hash function

The hash function is the heart of a hash table. It converts a key into an index of the internal array. The hash function for a hash table should be fast, deterministic, and have a uniformly distributed set of output values to prevent collision. Even though a hash function might be mathematically uniform if used with skewed input(keys), it might still lead to a collision, so it should be chosen with the use case in mind.

// Diagram: The hash function maps keys to a hash value

## Collision resolution

Choosing a hash function is only half the job. Its performance and chances of collision also depend on the data set it is used on. No matter how good a hash function is, there will be chances of collisions if the domain set (unique key values) is large.

A hash table also encapsulates a collision resolution mechanism for such cases. This mechanism transparently decides how to handle collisions so that the data is not lost and the operations on the hash table are still efficient.

// Diagram: Multiple keys can collide at the same hash value

Later in this course, we will learn about different implementations of a hash table that use different hashing techniques and collision resolution mechanisms. Every method has its tradeoffs, and the user should choose the collision resolution that best suits the use case.

***

# Overview of supported operations

Now that we know what a hash table is and how it works using a hash function and internal array, we can dive a bit deeper and understand the different operations that can be performed on it. Every data structure has its special powers, and for a hash table, it is ultra-fast storage and retrieval of mappings(key-value pairs). Below are the primary operations on a hash table and their high-level working.

## Insert operation

The insert operation is one of the primary operations on a hash table and is used to store a key-value mapping. A key-value mapping is stored by hashing the key to get the index in the internal array and storing the key-value pair at that location. If the key is already present in the table, its value is updated to the new value.

// Diagram: Insert a key value mapping into the hash table

## Search operation

The search operation is another primary operation on a hash table and is used to retrieve the mapped value for a given key. The value is retrieved by passing the given key to the hash function to get the index in the internal array and fetching the value at that location. If the value key-value mapping does not exist, the search function returns an error value to indicate it or throws an error.

// Diagram: Search for key in the hash table

## Delete operation

The delete operation deletes the key-value mapping for a given key from the hash table. The given key is passed to the hash function to get its index in the internal array, and the value at that location is deleted. If the value key-value mapping does not exist, the operation is treated as a no-op(nothing done)

// Diagram: Delete a key from the hash table

## Handling collisions

The operations above are the primary operations on the hash table data structure, and we carefully selected examples to avoid collision. This is because there is no single implementation of a hash table, and the collision resolution technique broadly divides the hash table implementation into two categories.

> -   Open addressing
> -   Separate chaining

The separate chaining scheme is generally implemented using an array of linked lists to deal with collisions, while open-addressing deals by probing the internal array for empty spots. The implementation of these primary operations depends on the collision resolution scheme used. We will learn about these operations in more detail later in this course when we learn about these collision resolution schemes.
