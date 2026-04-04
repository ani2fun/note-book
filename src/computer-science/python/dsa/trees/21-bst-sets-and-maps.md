# BST Sets and Maps

Balanced BSTs are often used to implement ordered sets and ordered maps.

They support:

- search
- insert
- delete
- ordered iteration
- range queries

The most important idea is not the exact Python code, but the capability:

- hash table: fast lookup, no natural ordering
- balanced BST: slightly slower lookup, but ordered traversal and range operations

In Python, `dict` and `set` are hash-based, so this topic is mostly conceptual unless you implement the tree yourself.
