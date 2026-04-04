# RAM

Before arrays make sense, memory needs to make sense.

## Mental model

RAM can be imagined as a long strip of numbered slots. Each slot has an address, and a program stores values at those addresses.

When values are stored contiguously, the program can compute where `arr[i]` lives without scanning earlier elements.

```mermaid
flowchart LR
    subgraph A["myArray"]
        I0["index 0<br/>value 1"]
        I1["index 1<br/>value 3"]
        I2["index 2<br/>value 5"]
    end

    subgraph B["RAM"]
        R0["address 1000<br/>1"]
        R1["address 1004<br/>3"]
        R2["address 1008<br/>5"]
    end

    I0 --> R0
    I1 --> R1
    I2 --> R2
```

## Why this matters

- Direct address calculation gives arrays `O(1)` index access.
- Contiguous layout makes caches happier.
- Inserting in the middle becomes expensive because later values must shift.

## Think in addresses

If a base address is `1000` and each integer uses `4` bytes, then:

- `arr[0]` lives at `1000`
- `arr[1]` lives at `1004`
- `arr[2]` lives at `1008`

That idea is the reason random access is so fast.
