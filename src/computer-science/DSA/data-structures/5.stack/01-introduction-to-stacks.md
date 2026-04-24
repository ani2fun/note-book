# 1. Introduction to stacks

## Table of contents

1. [Understanding the problem](#understanding-the-problem)
2. [Exploring a possible solution](#exploring-a-possible-solution)
3. [Key properties of a stack](#key-properties-of-a-stack)
4. [Overview of supported operations](#overview-of-supported-operations)

***

# Understanding the problem

To better understand a stack, let us look at some interesting problems programmers face when designing software systems. Many times in a program, we need to have a data store that is **smart** enough and remembers the order in which the data was added. This is especially useful in cases where we want to process data items in a **L**ast **I**n **F**irst **O**ut **(LIFO)** or **F**irst **I**n **L**ast **O**ut (**FILO**) order. This is a fairly common requirement in many use cases, some of which we will look at now.

// Diagram: LIFO or FILO

> Last In First Out (LIFO), also known as First In Last Out (FILO), is a method of processing data items in the reverse order of their addition. This means that the data item added last to the data store will be the first one to be processed.

## Web browsers

This is perhaps the most visible use case where the order of data items matters. All modern web browsers have a **back** button that takes you to the previous webpage you were browsing. This functionality is very simple and straightforward, but to implement this, we need to store all the web pages the user visits and present the data in reverse **(LIFO)** order when the user clicks the back button.

// Diagram: Web browsers rely on the LIFO order to implement the "back" feature

## Text editors

Like web browsers, this is another example of a problem that relies on the order of data added to a data store. Almost all text editors have an **undo** feature that lets us revert changes in the order we make them. To implement this functionality, text editors need to store all the user data somewhere and retrieve it in the reverse (**LIFO**) order.

// Diagram: Text editors rely on the LIFO order to implement the "undo" feature

## Nested function calls

This is another problem where the order of data items in a data store matters. A function call in almost all programming languages returns the execution to the calling function, which returns the execution to the function that called it, and this chain goes on. This order of returning control is essentially the reverse order in which the functions were called. The processor in a computer system has a smart data structure that stores the order of these function calls and returns the control in the reverse **(LIFO)** order when requested.

// Diagram: Nested function calls rely on the LIFO order work correctly

Like the above three examples, many other problems can only be solved by the Last In First Out (**LIFO**) order of processing data. In this course, we will learn how these problems can be solved by a magical data structure called **stack**.

***

# Exploring a possible solution

Now that we know that some problems can only be solved by processing data items in a LIFO order, we can look at a data structure that inherently maintains this order by design. A stack is a linear container that allows adding and removing items at only one end. This restriction on adding and removing items only from one end ensures that what goes last in the stack comes out first (LIFO).

## Stack of plates

A real-life example is a stack of plates. Only the plate at the top can be removed. To remove a plate from the bottom, we need to remove all the plates above it. Similarly, any new plate can only be added at the top of this stack of plates.

// Diagram: A stack of plates follow a LIFO order

## Stack data structure

When implemented in a programming language to store data items and retrieve them in a LIFO order, this abstract idea of a stack is called a stack data structure. This data structure can effectively solve all the LIFO processing problems we learned about earlier.

// Diagram: A stack data structure holding some integer values

Like a real-world stack, we can mimic the LIFO order by restricting the addition and removal of data only at one end.

// Diagram: The stack data structure mimics the LIFO order of a real world stack

A stack is a core data structure in computer programming used in various places to solve complex problems. This course will teach us more about this magical data structure that draws inspiration from the real world.

***

# Key properties of a stack

Now that we know what a stack is and why it is such a useful data structure let's look at its different properties and useful components. These properties are modified when we add or remove data to or from the stack.

## Capacity

A stack's capacity is the maximum number of data items it can hold. Only **bounded** stacks have a predefined capacity. **Unbounded** stacks ideally have an unlimited capacity restricted only by the amount of memory available on the system where the code executing the stack implementation is running.

// Diagram: The capacity of a stack

## Size

The size of a stack is the number of data items it holds at any given time. This value changes when data items are added to or removed from the stack.

// Diagram: Size of a stack

## Top

The data item inserted last into the stack appears to be at the top of the stack in its logical representation; hence, it is called the **top** of the stack. If the stack is empty, there is no data at the top of the stack.

// Diagram: Top of the stack is the last item inserted into it

***

# Overview of supported operations

Now that we know the different properties and components of the stack data structure, we can explore its support for operations, which store and retrieve data from the stack.

## Push

The push operation on a stack is the only way to add data to a stack. This operation adds a data item to the **top** of the stack and increases its size by 1.

// Diagram: Push operation on a stack

**Why does the stack not support inserting anywhere, like a linked list?**

The stack data structure only supports insertion at one end, ensuring that data items follow the **L**ist **I**n **F**irst **O**ut **(LIFO)** property. 

## Pop

The pop operation is the only way to remove data from a stack. It removes the data item at the **top** of the stack and decreases its size by 1.

// Diagram: Pop operation on a stack

**Why does stack not support removing items from anywhere, like a linked list?**

The stack data structure only supports removing data items from the **same end** where they were inserted, ensuring that data items follow the **L**ist **I**n **F**irst **O**ut **(LIFO)** property. 

## Size

Size is also a property of the stack. The size operation returns the value of this property, which is the current size of the stack.

// Diagram: Size operation on a stack

## Top

Like size, the top is also a property of the stack, and the top operation returns the value of this property, which is the data item at the top of the stack.

// Diagram: Top operation on a stack

**Why does a stack not support traversal like a linked list?**

A linked list and stack serve very different purposes. Linked lists maintain a linear list of data items, and the use case supports access to data items anywhere in the list. On the other hand, a stack is primarily used as a data store that stores and returns data items in the **L**ist **I**n **F**irst **O**ut **(LIFO)** order and hence has no use case for traversal.
