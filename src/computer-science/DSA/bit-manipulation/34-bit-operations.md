# Bit Operations

You can check, set, clear, and flip any single bit — the foundation of cryptography, compression, and graphics.

This page is a practical tour of all six bitwise operators, the most useful tricks built from them, and the real systems that depend on them every day.

---

## Reading Binary in Python

Before anything else, get comfortable reading and writing numbers in binary.

```python,editable
# bin() shows the binary string, format strings let you control width
n = 42

print(f"Decimal:     {n}")
print(f"Binary:      {bin(n)}")
print(f"Fixed-width: {n:08b}")   # 8-bit zero-padded
print(f"Hex:         {hex(n)}")
print()

# You can write literals directly in binary
x = 0b00101010   # Same as 42
print(f"0b00101010 = {x}")
print(f"Bit length: {x.bit_length()} bits")
```

---

## AND ( & ) — Masking and Checking Bits

AND keeps a bit only when **both** operands have it set. Its primary use is masking: isolating specific bits by ANDing with a pattern (the mask) that has 1s only in the positions you care about.

```python,editable
# --- Check if a number is even or odd ---
# The lowest bit is 1 for odd numbers, 0 for even numbers
for n in range(8):
    parity = "odd" if n & 1 else "even"
    print(f"{n} = {n:04b}  ->  {parity}")

print()

# --- Extract specific bits with a mask ---
byte = 0b11010110   # 214

lower_nibble = byte & 0b00001111   # Mask: keep only the lower 4 bits
upper_nibble = (byte >> 4) & 0b00001111   # Shift down, then mask

print(f"byte         = {byte:08b}  ({byte})")
print(f"lower nibble = {lower_nibble:08b}  ({lower_nibble})")
print(f"upper nibble = {upper_nibble:08b}  ({upper_nibble})")
```

---

## OR ( | ) — Setting Bits

OR sets a bit to 1 wherever **either** operand has a 1. Use it to switch specific bits on without disturbing the rest.

```python,editable
flags = 0b00000000   # All flags off

READ    = 0b00000100  # bit 2
WRITE   = 0b00000010  # bit 1
EXECUTE = 0b00000001  # bit 0

# Grant read and write permission
flags = flags | READ | WRITE

print(f"flags = {flags:08b}  ({flags})")

# Check individual permissions
print(f"Can read?    {'yes' if flags & READ    else 'no'}")
print(f"Can write?   {'yes' if flags & WRITE   else 'no'}")
print(f"Can execute? {'yes' if flags & EXECUTE else 'no'}")

print()
# This is exactly how Unix file permissions (rwxrwxrwx) work
# chmod 644 sets: owner=110 (rw-), group=100 (r--), other=100 (r--)
chmod_644 = 0b110100100
print(f"chmod 644 = {chmod_644:09b}  (owner: rw-, group: r--, other: r--)")
```

---

## XOR ( ^ ) — Flipping Bits and Cancellation

XOR outputs 1 only when the two input bits differ. It has two elegant properties:

- `a ^ a == 0` — a value XOR'd with itself cancels out
- `a ^ 0 == a` — a value XOR'd with zero is unchanged

These properties make XOR the go-to operator for toggling bits and finding the unique element in a list.

```python,editable
# --- Flip (toggle) specific bits ---
byte = 0b10110100
mask = 0b00001111   # Flip the lower 4 bits

flipped = byte ^ mask
print(f"Original: {byte:08b}")
print(f"Mask:     {mask:08b}")
print(f"Flipped:  {flipped:08b}")
print()

# --- Find the unique number in a list ---
# Every number appears twice EXCEPT one.
# XOR of a number with itself is 0, so all pairs cancel out.
nums = [4, 1, 2, 1, 2, 4, 7, 3, 3]
result = 0
for n in nums:
    result ^= n
print(f"Numbers:       {nums}")
print(f"Unique number: {result}")
print()

# --- Swap two variables without a temporary variable ---
a, b = 13, 27
print(f"Before: a={a}, b={b}")
a ^= b
b ^= a
a ^= b
print(f"After:  a={a}, b={b}")
```

---

## NOT ( ~ ) — Complement

NOT flips every bit. In Python, integers have arbitrary precision and use two's complement representation, so `~n` always equals `-(n+1)`.

```python,editable
for n in [0, 1, 5, 42, 127]:
    print(f"~{n} = {~n}")

print()
# In fixed-width contexts (like 8-bit hardware), NOT is simpler.
# For an 8-bit value, you AND with 0xFF to mask to 8 bits:
n = 0b10110100   # 180
complement_8bit = (~n) & 0xFF
print(f"n              = {n:08b}  ({n})")
print(f"~n (8-bit)     = {complement_8bit:08b}  ({complement_8bit})")
print(f"n + ~n (8-bit) = {n + complement_8bit}  (always 255 for 8-bit)")
```

---

## Left Shift ( << ) — Multiply by Powers of 2

Shifting bits left by `k` positions is equivalent to multiplying by `2^k`, and it executes in a single CPU instruction.

```python,editable
n = 1

print("Left shifts — powers of 2:")
for k in range(9):
    shifted = n << k
    print(f"  1 << {k} = {shifted:>4}  ({shifted:08b})")

print()
# Practical: building bitmasks for specific positions
print("Building position masks:")
for position in [0, 1, 3, 7]:
    mask = 1 << position
    print(f"  bit {position}: {mask:08b}  (decimal {mask})")
```

---

## Right Shift ( >> ) — Divide by Powers of 2

Shifting bits right by `k` positions is equivalent to integer division by `2^k`.

```python,editable
n = 256

print("Right shifts — halving repeatedly:")
for k in range(9):
    shifted = n >> k
    print(f"  256 >> {k} = {shifted:>4}")

print()
# Practical: extract which 'chunk' a value falls in
# (Used in hash tables, image processing, memory addressing)
value = 0b11010110   # 214
print(f"value = {value:08b}  ({value})")
print(f"upper 4 bits = {value >> 4:04b}  ({value >> 4})")
print(f"lower 4 bits = {value & 0xF:04b}  ({value & 0xF})")
```

---

## Common Bit Tricks

These patterns appear so frequently they are worth memorising.

```python,editable
# --- n & 1: Check parity (even/odd) ---
print("=== n & 1: parity check ===")
for n in [0, 1, 6, 7, 100, 101]:
    print(f"  {n} is {'odd' if n & 1 else 'even'}")

print()

# --- n & (n-1): Clear the lowest set bit ---
# Counts bits, detects powers of 2
print("=== n & (n-1): clear lowest set bit ===")
for n in [12, 8, 7, 6]:
    result = n & (n - 1)
    print(f"  {n:04b} & {n-1:04b} = {result:04b}  ({n} & {n-1} = {result})")

print()

# --- Power of 2 check: a power of 2 has exactly one 1-bit ---
print("=== Power of 2 detection ===")
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

for n in [1, 2, 3, 4, 5, 8, 16, 12, 1024, 1000]:
    print(f"  {n:>5}: {is_power_of_two(n)}")

print()

# --- Count set bits (Brian Kernighan's algorithm) ---
print("=== Count set bits ===")
def count_bits(n):
    count = 0
    while n:
        n &= n - 1   # Clear the lowest set bit each iteration
        count += 1
    return count

for n in [0, 1, 7, 8, 255, 42]:
    print(f"  {n:>3} = {n:08b}  ->  {count_bits(n)} bit(s) set")
```

---

## Real-World Applications

```python,editable
# === 1. RGB Colour Channels (Image Processing) ===
# A 24-bit colour packs red, green, blue into one integer
colour = 0xFF8C00   # Dark orange

red   = (colour >> 16) & 0xFF
green = (colour >>  8) & 0xFF
blue  =  colour        & 0xFF

print(f"Colour: #{colour:06X}")
print(f"  R = {red}   ({red:08b})")
print(f"  G = {green}   ({green:08b})")
print(f"  B = {blue}    ({blue:08b})")
print()

# === 2. Network Subnet Masks ===
# A subnet mask isolates the network portion of an IP address
ip      = (192 << 24) | (168 << 16) | (1 << 8) | 42   # 192.168.1.42
mask    = (255 << 24) | (255 << 16) | (255 << 8) | 0   # 255.255.255.0

network = ip & mask
host    = ip & (~mask & 0xFFFFFFFF)

def ip_str(n):
    return f"{(n>>24)&0xFF}.{(n>>16)&0xFF}.{(n>>8)&0xFF}.{n&0xFF}"

print(f"IP address:  {ip_str(ip)}")
print(f"Subnet mask: {ip_str(mask)}")
print(f"Network:     {ip_str(network)}")
print(f"Host:        {host}")
print()

# === 3. XOR in Cryptography ===
# XOR is the core of stream ciphers: ciphertext = plaintext XOR key
message = [72, 101, 108, 108, 111]   # "Hello" as ASCII
key     = [0xAB, 0xCD, 0xEF, 0x12, 0x34]

encrypted = [m ^ k for m, k in zip(message, key)]
decrypted = [e ^ k for e, k in zip(encrypted, key)]   # XOR again to reverse

print(f"Message:   {[chr(b) for b in message]}")
print(f"Encrypted: {[hex(b) for b in encrypted]}")
print(f"Decrypted: {[chr(b) for b in decrypted]}")
print()

# === 4. Chess Bitboards ===
# A standard chessboard has 64 squares — fits in a 64-bit integer.
# Each piece type gets its own 64-bit mask.
# White pawns on starting rank (rank 2 = bits 8-15):
white_pawns = 0b0000000000000000000000000000000000000000000000001111111100000000

print("White pawns starting position:")
for rank in range(7, -1, -1):
    row = (white_pawns >> (rank * 8)) & 0xFF
    print(f"  Rank {rank+1}: {row:08b}")
print()

# === 5. Unix File Permissions ===
# rwxrwxrwx is stored as a 9-bit integer
OWNER_R = 0o400
OWNER_W = 0o200
OWNER_X = 0o100
GROUP_R = 0o040
GROUP_W = 0o020
GROUP_X = 0o010
OTHER_R = 0o004
OTHER_W = 0o002
OTHER_X = 0o001

# chmod 755 (rwxr-xr-x)
perms = OWNER_R | OWNER_W | OWNER_X | GROUP_R | GROUP_X | OTHER_R | OTHER_X
print(f"chmod 755:")
print(f"  Octal:  {oct(perms)}")
print(f"  Binary: {perms:09b}")
print(f"  owner write? {'yes' if perms & OWNER_W else 'no'}")
print(f"  group write? {'yes' if perms & GROUP_W else 'no'}")
print(f"  other write? {'yes' if perms & OTHER_W else 'no'}")
```

---

## Summary Table

| Trick | Code | Use Case |
|---|---|---|
| Check odd/even | `n & 1` | Parity, loop branching |
| Clear lowest set bit | `n & (n-1)` | Counting bits, power-of-2 check |
| Check power of 2 | `n > 0 and n & (n-1) == 0` | Alignment checks |
| Set bit k | `n \| (1 << k)` | Grant permissions, set flags |
| Clear bit k | `n & ~(1 << k)` | Revoke permissions, clear flags |
| Toggle bit k | `n ^ (1 << k)` | Flip a flag |
| Check bit k | `(n >> k) & 1` | Read a flag |
| Multiply by 2^k | `n << k` | Fast scaling |
| Divide by 2^k | `n >> k` | Fast downscaling, extracting channels |
| XOR swap | `a^=b; b^=a; a^=b` | No temp variable needed |
