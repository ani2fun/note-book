# SQL Notes

> Browser execution note:
> Most `SELECT` queries in this section can now run directly in the browser against an in-memory SQLite database with preloaded sample data such as `customers`, `orders`, and `Sales.*` tables.
> SQL Server setup scripts and T-SQL-specific syntax are still reference-only. That includes commands and features like `GO`, `USE`, `CREATE DATABASE`, `ALTER DATABASE`, `DROP DATABASE`, and some SQL Server-only functions such as `FORMAT()`.

## Table of Content

- [Introduction](./1.introduction.md)
    - [Examples & Sample Data](./sample-data.md)
        - [SELECT Query](./1.1.sql-select-query.md)
        - [Data Definition Language (DDL)](./1.2.data-definition-ddl.md)
        - [Data Manipulation (DML)](./1.3.data-manipulation-dml.md)
        - [Filtering Data](./1.4.filtering-data.md)
    - [JOIN And SET](./2.joinsandsets-intro.md)
        - [JOIN Query](./2.1.joins-query-examples.md)
        - [SET Query](./2.1.sets-query-examples.md)
    - [ROW Level Functions](./3.row-level-functions-intro.md)
        - [String Functions Examples](./3.1.string-functions.md)
        - [Number Functions Examples](./3.2.number-functions.md)
        - [Date and Time Functions Examples](./3.3.date-and-time-functions.md)
        - [Date and Time Formats Examples](./3.4.date-and-time-format.md)
        - [NULL Functions Examples](./3.5.NULL-functions.md)
        - [CASE Statements Examples](./3.6.CASE-statements.md)
    - [Aggregation Analytical Functions](./4.Aggregation-Analytical-Functions-Intro.md)
        - [Aggregate Functions](./4.0.aggregate-functions.md)
        - [Window Functions Basics Examples](./4.1.Window-Functions-basics.md)
        - [Window Aggregations Examples](./4.2.Window-Aggregations-exmaples.md)
        - [Window Ranking Functions Examples](./4.3.Window-ranking-examples.md)
        - [Window Value Functions Examples](./4.4.Window-value-examples.md)
