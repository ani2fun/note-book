# 11. Design

## Table of contents

1. [Design a LRU cache](#design-a-lru-cache)
2. [Design a randomised set](#design-a-randomised-set)

***

# Design a LRU cache

## Problem Statement

Given the skeleton of an **LRUCache class**, complete this class by implementing all the LRUCache operations below.

More details about an LRU cache can be found here - **Least recently used (LRU) cache.** You can learn more about an LRU cache here - [link](https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU)

> -   **LRUCache(int capacity)** - Initializes the LRUCache object with the given capacity.
> -   **get(int key)** - Returns the value associated with the key if it exists. Otherwise, it returns \`-1\`.
> -   **put(int key, int value)** - Updates the value for the key if it exists. If the key is not present, it adds the (key, value) pair to the cache. If this operation causes the number of keys to exceed the capacity, the least recently used key will be evicted.

// Diagram: You must abide by the following constraints

// Diagram: 1\. You must implement this without using any built-in LRUCache libraries

2. The functions **get** and **put** operations must each run in amortised `O(1)` time complexity.

> The input should adhere to the following rules:
>
> 1.  The input should contain two arrays of the same size.
> 2.  The first array should contain the list of operations, while the second should contain the corresponding operands for those operations.
> 3.  The first index in the first array should contain **LRUCache**, and the first index in the second array should contain a single positive integer representing the capacity of the lru cache. This value is used to initialise the lru cache.
> 4.  For each index in the first array that contains the **put** operation, the corresponding index in the second array should contain a (key, value) pair to be inserted.
> 5.  For each index in the first array that contains the **get** operation, the corresponding index in the second array should contain the key for which that operation needs to be performed.
>
> **Example:**
>
> -   **Input:** \[LRUCache, put, put, get, put, get, get\] \[\[2\], \[1, 10\], \[2, 20\], \[1\], \[3, 30\], \[1\], \[2\]\]
>
> -   **Output:** \[null, null, null, 10, null, 10, -1\]
>
> **Explanation:**
>
> **Operation:** LRUCache lruCache = new LRUCache(2) **Result:** Initializes an empty \`LRUCache\` with a capacity of 2
>
> **Operation:** lruCache.put(1, 10) **Result:** \`cache = \[\[1, 10\], \[\]\]\`
>
> **Operation:** lruCache.put(2, 20) **Result:** \`cache = \[\[2, 20\], \[1, 10\]\]\`
>
> **Operation:** lruCache.get(1) **Result:** Brings key \`1\` to the front \`cache = \[\[1, 10\], \[2, 20\]\]\`, returns \`10\`
>
> **Operation:** lruCache.put(3, 30) **Result:** Evicts the least recently used key \`2\`, \`cache = \[\[3, 30\], \[1, 10\]\]\`
>
> **Operation:** lruCache.get(1) **Result:** Brings key \`1\` to the front \`cache = \[\[1, 10\], \[3, 30\]\]\`, returns \`10\`
>
> **Operation:** lruCache.get(2) **Result:** Returns \`-1\`

## Solution

```cpp
#include <list>
#include <unordered_map>

using namespace std;

// Define a struct for the nodes in the doubly linked list
struct Node {
    int key;
    int val;
    Node(int k, int v) : key(k), val(v) {}
};

class LRUCache {
private:

    // Member variables for the cache capacity, the doubly linked
    // list, and the map of keys to nodes
    int capacity;
    list<Node> cache;
    unordered_map<int, list<Node>::iterator> keyAddressMap;

public:
    LRUCache(int capacity) { this->capacity = capacity; }

    int get(int key) {

        // Check if the key exists in the map
        if (keyAddressMap.count(key)) {

            // Move the corresponding node to the front of the list
            auto it = keyAddressMap[key];
            cache.splice(cache.begin(), cache, it);

            // Return the value of the node
            return it->val;
        }

        // If the key does not exist, return -1
        return -1;
    }

    void put(int key, int value) {

        // If the key already exists in the cache, update its value
        if (keyAddressMap.count(key)) {

            // Move the corresponding node to the front of the list and
            // update its value
            auto it = keyAddressMap[key];
            it->val = value;
            cache.splice(cache.begin(), cache, it);
        }

        // If the key does not exist in the cache, add it to the
        // front of the list.
        else {

            // If the cache is full, remove the least recently used node
            // from the back of the list
            if (cache.size() == capacity) {
                Node lastNode = cache.back();
                keyAddressMap.erase(lastNode.key);
                cache.pop_back();
            }

            // Create a new node for the key-value pair and add it to the
            // front of the list
            Node node(key, value);
            cache.push_front(node);

            // Map the key to the node in the cache
            keyAddressMap[key] = cache.begin();
        }
    }
};
```

***

# Design a randomised set

## Problem Statement

Given the skeleton of a **RandomisedSet class**, complete this class by implementing all the RandomisedSet operations below.

> -   **RandomisedSet()** - Initializes the RandomisedSet object.
> -   **insert(int val)** - Inserts the given value into the set if it is not already present. Returns \`true\` if the item was added, \`false\` otherwise.
> -   **remove(int val)** - Removes the given value from the set if it is present. Returns' true' if the item was removed, ' false' otherwise.
> -   **getRandom()** - Returns a random element from the current set of elements (it's guaranteed that at least one element exists when this method is called). Each element has an equal probability of being returned.

You must abide by the following constraints.

1\. You must implement the class operations such that each operation works on amortised `O(1)` time complexity.

> The input should adhere to the following rules:
>
> 1.  The input should contain two arrays of the same size.
> 2.  The first array should contain the list of operations, while the second should contain the corresponding operands for those operations.
> 3.  The first index in the first array should contain **RandomisedSet**, and the first index in the second array should contain an empty array. This is used for initialising the RandomisedSet.
> 4.  For each index in the first array that contains **insert** or **remove** operations, the corresponding index in the second array should contain the value for which that operation will be performed.
> 5.  For each index in the first array that contains the **getRandom** operation, the corresponding index in the second array should contain an empty array.
>
> **Example:** **Example:**
>
> -   **Input:** \[RandomisedSet, insert, insert, insert, remove, getRandom\] \[\[\], \[2\], \[4\], \[6\], \[2\], \[\]\]
>
> -   **Output:** \[null, true, true, true, true, 4\]
>
> **Explanation:**
>
> **Operation:** RandomisedSet randomisedSet = new RandomisedSet() **Result:** Initializes an empty \`RandomisedSet\` object
>
> **Operation:** randomisedSet.insert(2) **Result:** \`set = \[2\]\`, returns \`true\`
>
> **Operation:** randomisedSet.insert(4) **Result:** \`set = \[2, 4\]\`, returns \`true\`
>
> **Operation:** randomisedSet.insert(6) **Result:** \`set = \[2, 4, 6\]\`, returns \`true\`
>
> **Operation:** randomisedSet.remove(2) **Result:** \`set = \[4, 6\]\`, returns \`true\`
>
> **Operation:** randomisedSet.getRandom() **Result:** \`set = \[4, 6\]\`, returns \`4\` or \`6\` randomly

## Solution

```cpp
#include <unordered_map>

using namespace std;

class RandomisedSet {
public:

    // Vector to store values
    vector<int> values;

    // Hash map to store values and their indices
    unordered_map<int, int> hashMap;
    RandomisedSet() {

        // Seed the random number generator
        srand(time(NULL));
    }

    bool insert(int val) {

        // If value already exists in the set
        if (hashMap.find(val) != hashMap.end()) {
            return false;
        }

        // Add value to the end of vector
        values.push_back(val);

        // Store the value and its index in hash map
        hashMap[val] = values.size() - 1;
        return true;
    }

    bool remove(int val) {

        // If value does not exist in the set
        if (hashMap.find(val) == hashMap.end()) {
            return false;
        }

        // Get the index of value in the vector
        int index = hashMap[val];

        // Get the last value in the vector
        int last = values.back();

        // Replace the value to remove with the last value in the vector
        values[index] = last;

        // Update the index of the last value in the hash map
        hashMap[last] = index;

        // Remove the last value from the vector
        values.pop_back();

        // Remove the value from the hash map
        hashMap.erase(val);
        return true;
    }

    int getRandom() {

        // Generate a random index in the range [0, size-1]
        int index = rand() % values.size();

        // Return the value at the random index
        return values[index];
    }
};
```
