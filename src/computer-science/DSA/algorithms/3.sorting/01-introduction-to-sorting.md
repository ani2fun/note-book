# Understanding the problem

To see why sorting is so important, let’s think about how we handle information in everyday life. When the amount of information is small, this usually isn’t a problem. We can easily find what we need, compare items, or notice patterns without much effort. But as the volume grows, even simple tasks can become confusing, time-consuming, or overwhelming. Let's look at a few examples to understand how quickly disorganised information becomes a challenge and why managing large amounts of data effectively is so important.

## Finding a contact in your phone

Imagine your phone has only ten contacts. Finding a contact named **Sarah** takes just a few seconds because you can quickly scan through the list. Even if the names aren’t organised in any particular order, there aren’t many places for Sarah to hide, so you can still locate her easily. At this small scale, the lack of order isn’t really a problem; you can get what you need without much effort.

// Diagram: Phone with ten contacts

But now imagine your phone has ten thousand contacts, all saved randomly with no order at all. Suddenly, everything becomes more difficult:

// Diagram: Phone with ten thousand contacts

## Online stores showing products

Think about a small online store with just ten products. If you’re looking for a specific item, like a pair of shoes, you can scroll through the listings quickly and compare options. You can see the prices, colours, and sizes at a glance, making a decision simple. For the store owner, managing inventory, updating product details, or highlighting special deals is easy and requires little effort.

// Diagram: Store with ten products

Now consider a massive online store with millions of products, like a global e-commerce platform. A shopper looking for a specific shoe could be faced with thousands of irrelevant items. Comparing prices and features takes much longer, and the system must process enormous amounts of data for each search. Small inefficiencies that are fine for a few dozen products can become major problems at this scale.

// Diagram: Store with millions of products

## Organizing student grades

Imagine you are a teacher with a class of ten students. You can quickly see who is doing well and who might need extra help. Calculating averages, identifying the top performers, and spotting patterns in the grades is simple. You can easily prepare reports, and if a mistake occurs, it’s easy to notice and fix. At this small scale, managing the data is straightforward.

// Diagram: Class with ten students

At a large university with thousands of students, identifying the top or bottom performers becomes much harder. Calculating averages and generating rankings requires more effort, and even small mistakes can affect thousands of students. What was simple for one class becomes a complex challenge at scale.

// Diagram: University with thousands of students

As we can see, disorganised information may not seem like a big deal at first, but as the amount of data grows, simple tasks can quickly become overwhelming. Searching, comparing, and analysing data all become more difficult when there’s no structure. The good news is that there are ways to manage these challenges. In the next section, we will explore how sorting can help solve these problems, making information easier to find, compare, and analyse, even at a large scale.

***

# Exploring a possible solution

Now that we have seen the problems caused by disorganised data at scale, let’s explore how sorting can help address them. At its core, sorting is the process of arranging items in a specific order according to a defined rule or priority. In daily life, this could mean alphabetising documents, arranging numbers from smallest to largest, or organising books on a shelf by genre or size. 

Sorting

> Sorting is the arrangement of items in a specific order, typically ascending or descending, based on criteria.

Let’s understand how sorting can address the problems we identified earlier, especially when dealing with large-scale data.

## Searching a name in a phone contact list

If your contacts are sorted alphabetically, you no longer need to scan every name. Instead, you can jump directly to the **S section**, where all names beginning with **S** are grouped together. Now, finding Sarah is just as easy with ten thousand contacts as it was with ten.

// Diagram: Phone with ten thousand contacts

## Online stores showing products

If products on a large e-commerce platform are sorted by price, rating, or relevance, shoppers don’t have to wade through millions of items to find what they want. They can quickly see the cheapest options, items in a given colour, the best-reviewed items, or the most relevant results at the top of the list. This makes browsing faster and more efficient, allowing users to make decisions quickly, even when the store has millions of products.

// Diagram: Store with millions of products

## Organising student grades

When student grades are sorted from highest to lowest, or sorted by class or subject, teachers and administrators can immediately identify top performers and students who need extra help. Trends become easier to spot, reports can be generated quickly, and errors are easier to catch. Even with hundreds of thousands of students, structured grade data makes managing and analysing performance practical and efficient.

// Diagram: University with thousands of students

## Sorting in software systems

In software systems, sorting involves arranging data elements, whether numbers, text, or categories, into a structured sequence so they can be accessed, analysed, or processed more efficiently. By creating order from chaos, sorting makes large amounts of information easier to manage, understand, and use.

Most, if not all, computer applications use sorting at some level; most of the time, it is not the main function of the application but a supporting function to assist the main application.

It is primarily used to improve the efficiency of certain functions. To name a few.

> -   **Efficient searching**: When a sequence is sorted, we can use algorithms like binary search for efficient searching.
> -   **Merging sequences:** Sorted sequences can be merged in a single pass.
> -   **Data processing:** Sorting streamlines data processing as it groups similar data.

***

# Classification of sorting algorithms

Before diving into sorting algorithms, it is important to understand how they are classified in computer science. Sorting algorithms are not all the same; they differ in the way they organise data, the efficiency of their operations, and the types of problems they are best suited to solve. By learning these classifications, we can better understand the trade-offs between different algorithms, such as speed, memory usage, stability, and simplicity. Sorting algorithms can be classified into the following groups

## Comparison sorting

Comparison-based sorting algorithms rely on comparing elements in the list to determine their order. These algorithms compare elements using a comparison operator (e.g., less than, greater than) and rearrange the elements based on the results of these comparisons. Most widely used sorting algorithms are comparison-based except for counting sort, which uses a counting-based approach.

// Diagram: Comparision sorting

## Stable sorting

A stable sort is a sorting algorithm that preserves the relative order of equal elements in the input list. In other words, if two elements in the input list have the same value and one comes before the other, they will also be in the same order in the sorted list. Stability is important in sorting algorithms, especially when sorting by multiple keys or when the original order of equal elements is significant. Some examples of stable sorts are Bubble sort, Insertion sort, and Merge sort.

// Diagram: Stable sorting

## Unstable sorting

An unstable sorting algorithm does not guarantee preserving the relative order of equal elements in the input list. In other words, if two elements in the input list have the same value and one comes before the other, they may not necessarily be in the same order in the sorted list. Some examples of unstable sorts are Selection sort, Quicksort, and Heap sort.

// Diagram: Unstable sorting

## In place sorting

In place sorting is a sorting algorithm that sorts the elements of an array or list without requiring additional space proportional to the number of sorted elements. In other words, the algorithm sorts the elements in the original array or list without using any extra memory. Some examples of unstable sorts are Bubble sort, Selection sort, and Heap sort.

// Diagram: In place sorting

## Out of place sorting

Out of place sorting is a sorting algorithm that requires additional space proportional to the number of sorted elements. In other words, the algorithm sorts the elements of an array or list by creating a new array or list to store the sorted elements rather than sorting the elements in the original array or list. Some examples of out-of-place sorts are Merge sort and Counting sort.

// Diagram: Out of place sorting

## Adaptive sorting

Adaptive sorting is a property of sorting algorithms that refers to their ability to take advantage of existing order in the input data to improve performance. In other words, an adaptive sorting algorithm can perform better when the input data is already partially sorted or nearly sorted. Some examples of adaptive sorts are Bubble sort and Insertion sort.

// Diagram: Adaptive sorting

## Non adaptive sorting

Non adaptive sorting is a property of sorting algorithms that refers to their inability to take advantage of existing order in the input data to improve performance. In other words, a non-adaptive sorting algorithm performs the same regardless of the input order. Some examples of out-of-place sorts are Selection sort, Merge sort, and Heap sort.

// Diagram: Non adaptive sorting

As we can see, there are multiple types of sorting algorithms, each with its own pros and cons. There is no such thing as a one-size-fits-all sort. The most efficient algorithm is chosen based on the specific use case. In the chapters, we will review the most popular sorting algorithms and understand what makes them good and bad for different use cases.

***

# Order check

## Problem Statement

Given an integer array **arr**, write a function that returns `true` if the array is sorted in non-decreasing order, return `false` otherwise.

### Example 1

> -   **Input:** arr = \[1, 2, 3, 4, 5\]
> -   **Output:** true
> -   **Explanation:** The array is sorted in non-decreasing order.

### Example 2

> -   **Input:** arr = \[1, 1, 1, 4, 5\]
> -   **Output:** true
> -   **Explanation:** The array is sorted in non-decreasing order.

### Example 3

> -   **Input:** arr = \[1, 3, 1, 4, 5\]
> -   **Output:** false
> -   **Explanation:** The array is not sorted in non-decreasing order.

## Solution

```cpp
using namespace std;

class Solution {
public:
    bool orderCheck(vector<int> &arr) {

        // Check each pair of adjacent elements
        for (int i = 1; i < arr.size(); i++) {

            // If the current element is smaller than the previous
            // element, the array is not sorted in non-decreasing order
            if (arr[i] < arr[i - 1]) {
                return false;
            }
        }
        return true;
    }
};
```
