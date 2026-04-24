# 1. Introduction to queues

## Table of contents

1. [Understanding the problem](#understanding-the-problem)
2. [Exploring a possible solution](#exploring-a-possible-solution)
3. [Key properties of a queue](#key-properties-of-a-queue)
4. [Overview of supported operations](#overview-of-supported-operations)

***

# Understanding the problem

To better understand a queue, let us look at some interesting problems programmers face when designing software systems. Many times in a program, we need to have a data store that is **smart** enough and remembers the order in which the data was added. A **stack** is a data structure that can be used where we need to Last In First Out (**LIFO**) order. However, there are cases when we need to process data in a **F**irst **I**n **F**irst **O**ut (**FIFO**) order. This is a fairly common requirement in many use cases, some of which we will look at now.

// Diagram: FIFO or LILO

> First In, First Out (FIFO), similar to Last In, Last Out (LILO), is a method of processing data items according to their addition. This means that the first data item added to the data store will be the first to be processed.

## Music players

This is perhaps the most visible use case where the order of data items matters. Almost all modern music players can add multiple songs to a list and play them one after the other in the **FIFO** order. This functionality is simple, but to implement this, we need to store all these songs somewhere and then play them in the order of their insertion.

// Diagram: Music Players rely on the FIFO order to implement the music list feature

## Call center

Like music players, this problem relies on the order of data added to a data store. Almost every automated call center reception software handles and processes calls made by customers in a **FIFO** order. To implement this functionality, this software needs to store the caller's information somewhere and retrieve it in the order of arrival to redirect it to the customer service agent when available.

// Diagram: Call scheduling softwares rely on the FIFO to serve customers

## Disk scheduling

Consider a situation where you copy multiple files from one location to another. This is another problem where the order of data items in a data store matters. A computer system with a single hard disk can perform only a single read/write operation simultaneously, so it cannot copy multiple files simultaneously. Newer, more modern hardware can do simultaneous read/write, but for demonstrating an example of FIFO, we consider the old ones. These hardware devices generally have an internal data structure (queue) that stores all the read/write requests and processes them in the order of arrival (**FIFO**). 

// Diagram: Disk schedulers rely on the FIFO order work correctly

Like the above three examples, many other problems can only be solved by processing data in the First-in-First-out (FIFO) order. In this course, we will learn how a magical data structure called a queue can solve these problems.

***

# Exploring a possible solution

Now that we know that some problems can only be solved by processing data items in a **FIFO** order, we can look at a data structure that inherently maintains this order by design. A queue is a linear container that has **two open ends**. It allows data to be added at one end and removed from another. This condition imposed on adding and removing items from two different ends ensures that what goes first in the queue comes out first (FIFO).

## Queue of people

A real-life example is a queue of people standing at the ticket counter to get tickets for a movie. A new person who wants to watch the movie joins the queue at the end. Similarly, the ticket counter only serves the person standing at the front of the queue. When a person gets their ticket, they walk out of the queue from the front, and the second person is at the front, ready to be served.

// Diagram: A queue of people at ticket counter follows FIFO order

## Queue data structure

When implemented in a programming language to store data items and retrieve them in a FIFO order, this abstract idea of a queue is called a queue data structure. This data structure can be used effectively to solve all the FIFO processing problems that we learned earlier.

// Diagram: A queue data structure holding some integer values

Like a real-world queue, we can mimic the FIFO order by restricting the addition and removal of data at two fixed ends.

// Diagram: The queue data structure mimics the FIFO order of a real world queue

A queue is one of the core data structures in computer programming and is used to solve complex problems in many places. This course will teach us more about this data structure that draws inspiration from the real world.

***

# Key properties of a queue

Now that we know what a queue is and why it is such a useful data structure let's look at its different properties and useful components. These properties are modified when we add or remove data to or from the queue.

## Capacity

A queue's capacity is the maximum number of data items it can hold. Only **bounded**queues have a predefined capacity. **Unbounded**queues ideally have an unlimited capacity restricted only by the amount of memory available on the system where the code executing the queue implementation is running.

// Diagram: The capacity of a queue

## Size

The size of a queue is the number of data items it holds at any given time. This value changes when data items are added to or removed from the queue.

// Diagram: Size of a queue

## Front

The oldest data item in the queue is present at the front of the removing end, ahead of all the other items in the queue in the logical representation of the queue, and is hence called the **front** of the queue. This is the item that will be removed and processed next.

// Diagram: The oldest data item in the queue is at the front

## Back

The most recent data item inserted into the queue is at the other end of the removing end behind all the other data items and is hence called **back**. The back of the queue is also sometimes called the **rear**.

// Diagram: The most recent data item in the queue is at the other end (back) of the queue

***

# Overview of supported operations

Now that we know the different properties and components of the queue data structure, we can explore its support for operations, which store and retrieve data from the queue.

## Enqueue

The enqueue operation is the only way to add data to a queue. This operation adds a data item to the **back** of the queue and increases its size by 1.

// Diagram: Enqueue multiple data items into the queue

**Why does the queue not support inserting anywhere like a linked list?**

The queue data structure only supports data insertion at one end, ensuring that data items always follow the First In, **F**irst **O**ut **(FIFO)** property. 

## Dequeue

The dequeue operation is the only way to remove data from a queue. It removes the data item at the **front** of the queue and decreases its size by 1.

// Diagram: Pop multiple data items from the queue

**Why does the queue not support removing items from anywhere, like a linked list?**

The queue data structure only supports removing data items from one end (opposite of the insertion end). This ensures data items follow the First In, **F**irst **O**ut **(FIFO)** property. 

## Size

**Size** is also a property of the queue. The size operation returns the value of this property, which is the current size of the queue.

// Diagram: Size operation on a queue

## Front

Like size, **front** is also a property of the queue, and the front operation returns the value of this property, which is the data item at the front of the queue.

// Diagram: Top operation on a queue

## Back

The queue also has a property called **back**, and the back operation returns the value of this property, which is the data item at the end (back) of the queue.

// Diagram: Top operation on a queue

**Why does a queue not support traversal like a linked list?**

A linked list and queue serve very different purposes. Linked lists maintain a linear list of data items, and the use case supports access to data items anywhere in the list. On the other hand, a queue is primarily used as a data store that stores and returns data items in the **F**ist **I**n **F**irst **O**ut **(FIFO)** order and hence has no use case for traversal.
