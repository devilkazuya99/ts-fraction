# ts-fraction

Recreation from original project [Fraction.js](https://github.com/rawify/Fraction.js)

Why:

- Try create project that can be package into ES6 module.
- Self learaning.

---

## Implemented Functions

| Function                              | Status |
| ------------------------------------- | ------ |
| Fraction abs()                        | ✅     |
| Fraction neg()                        | ✅     |
| Fraction add(n)                       | ✅     |
| Fraction sub(n)                       | ✅     |
| Fraction mul(n)                       | ✅     |
| Fraction div(n)                       | ✅     |
| Fraction pow(exp)                     | ✅     |
| Fraction mod(n)                       | ✅     |
| Fraction gcd(n)                       | ✅     |
| Fraction lcm(n)                       | ✅     |
| Fraction ceil([places])               | ✅     |
| Fraction floor([places])              | ✅     |
| Fraction round([places])              | ✅     |
| Fraction inverse()                    | ✅     |
| Fraction simplify([eps])              | ✅     |
| boolean equals(n)                     | ✅     |
| int compare(n)                        | ✅     |
| boolean divisible(n)                  | ✅     |
| double valueOf()                      | ✅     |
| String toString([decimalPlaces=15])   | ✅     |
| String toLatex(excludeWhole=false)    | ✅     |
| String toFraction(excludeWhole=false) | ✅     |
| Array toContinued()                   | ✅     |
| Fraction clone()                      | ✅`    |

---

## Testing

Library: `jasmine`

```
npm run test
```

Library: `ts-node`

```
ts-node-esm test1.ts
```

---

## Copyright and licensing

Copyright (c) 2023, **devilkazuya99** Licensed under the MIT license.
