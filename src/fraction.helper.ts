import Fraction from "./fraction.js";

const enableDebug = false;
const MAX_CYCLE_LEN = 2000;

const logger = {
    debug: (...o: any) => {
        if (enableDebug) {
            console.log(o);
        }
    }
};

export const DivisionByZero = () => {
    return new Error("Division by Zero");
};

export const InvalidParameter = () => {
    return new Error("Invalid argument");
};

export const NonIntegerParameter = () => {
    return new Error("Parameters must be integer");
};


export const parseNumber = (s: string) => {
    // console.log('parsing number:', s);
    let cs = s.replace(/[^0-9\.-]/g, '');
    // console.log('besore parsing number:', cs);
    const r = cs.includes(".") ? parseFloat(cs) : parseInt(cs, 10);
    // console.log('result = ', r);
    return r;
};


export const gcd = (a: number, b: number) => {
    if (!a)
        return b;
    if (!b)
        return a;

    while (true) {
        a %= b;
        if (!a)
            return b;
        b %= a;
        if (!b)
            return a;
    }
};

export const convertFloatToFraction = (f: number) => {
    console.log('convert Float To Fraction for: ', f);
    let vf = Math.abs(f);
    let n = 0;
    while (vf % 1 != 0 && n < MAX_CYCLE_LEN) {
        vf *= 10;
        n++;
    }
    console.log('what is f: ', f);
    return simplify(new Fraction({
        n: vf,
        d: Math.pow(10, n),
        s: f < 0 ? -1 : 1
    }));
};

export const simplify = (frc: Fraction) => {
    const c = gcd(frc.n, frc.d);
    return new Fraction({
        n: frc.n / c,
        d: frc.d / c,
        s: frc.s
    });
};

export type ParseData = {
    n: number,
    d: number,
    s?: number,
};
export const isParseData = (x: unknown): x is ParseData => {
    const hasN = !!x['n'] && !isNaN(x['n']);
    const hasD = !!x['d'] && !isNaN(x['d']);
    const hasS = !!x['s'] && !isNaN(x['s']);
    const r = (hasN && hasD);
    logger.debug('ParseData = ', x, ' isParseData() = ', (r));
    return r;
};

export const assign = (n: number, s: number) => {
    if (isNaN(n)) {
        throw InvalidParameter();
    }
    return n * s;
};

const parse = (p1: number | number[] | string | ParseData, p2?: number): ParseData => {

    let n = 0, d = 1, s = 1;
    let v = 0, w = 0, x = 0, y = 1, z = 1;

    let A = 0, B = 1;
    let C = 1, D = 1;

    const N = 10000000;
    let M;

    if (p2 !== undefined) {
        if (Array.isArray(p1) || isParseData(p1)) {
            throw NonIntegerParameter();
        }
        n = typeof p1 === 'string' ? parseNumber(p1) : p1;
        d = p2;
        s = n * d;

        if (n % 1 !== 0 || d % 1 !== 0) {
            throw NonIntegerParameter();
        }

    } else
        // switch (typeof p1) {
        if (isParseData(p1)) {
            if (p1.d && p1.n) {
                n = p1.n;
                d = p1.d;
                if (p1.s) { n *= p1.s; }
            } else {
                throw InvalidParameter();
            }
            s = n * d;
        } else if (Array.isArray(p1)) {
            n = p1[0];
            if (1 in p1) {
                d = p1[1];
            }
            s = n * d;
        } else if (typeof p1 === 'number') {
            // case "number":
            if (p1 < 0) {
                s = p1;
                p1 = -p1;
            }

            if (p1 % 1 === 0) {
                n = p1;
            } else if (p1 > 0) { // check for != 0, scale would become NaN (log(0)), which converges really slow

                if (p1 >= 1) {
                    z = Math.pow(10, Math.floor(1 + Math.log(p1) / Math.LN10));
                    p1 /= z;
                }

                // Using Farey Sequences
                // http://www.johndcook.com/blog/2010/10/20/best-rational-approximation/

                while (B <= N && D <= N) {
                    M = (A + C) / (B + D);

                    if (p1 === M) {
                        if (B + D <= N) {
                            n = A + C;
                            d = B + D;
                        } else if (D > B) {
                            n = C;
                            d = D;
                        } else {
                            n = A;
                            d = B;
                        }
                        break;

                    } else {

                        if (p1 > M) {
                            A += C;
                            B += D;
                        } else {
                            C += A;
                            D += B;
                        }

                        if (B > N) {
                            n = C;
                            d = D;
                        } else {
                            n = A;
                            d = B;
                        }
                    }
                }
                n *= z;
            } else if (isNaN(p1)) {
                d = n = NaN;
            }
            // break;
        } else if (typeof p1 === 'string')
        // case "string":
        {
            const matches = p1.match(/\d+|./g);

            if (matches === null)
                throw InvalidParameter();

            if (matches[A] === '-') {// Check for minus sign at the beginning
                s = -1;
                A++;
            } else if (matches[A] === '+') {// Check for plus sign at the beginning
                A++;
            }

            if (matches.length === A + 1) { // Check if it's just a simple number "1234"
                w = assign(parseNumber(matches[A++]), s);
            } else if (matches[A + 1] === '.' || matches[A] === '.') { // Check if it's a decimal number

                if (matches[A] !== '.') { // Handle 0.5 and .5
                    v = assign(parseNumber(matches[A++]), s);
                }
                A++;

                // Check for decimal places
                if (A + 1 === matches.length || matches[A + 1] === '(' && matches[A + 3] === ')' || matches[A + 1] === "'" && matches[A + 3] === "'") {
                    w = assign(parseNumber(matches[A]), s);
                    y = Math.pow(10, matches[A].length);
                    A++;
                }

                // Check for repeating places
                if (matches[A] === '(' && matches[A + 2] === ')' || matches[A] === "'" && matches[A + 2] === "'") {
                    x = assign(parseNumber(matches[A + 1]), s);
                    z = Math.pow(10, matches[A + 1].length) - 1;
                    A += 3;
                }

            } else if (matches[A + 1] === '/' || matches[A + 1] === ':') { // Check for a simple fraction "123/456" or "123:456"
                w = assign(parseNumber(matches[A]), s);
                y = assign(parseNumber(matches[A + 2]), 1);
                A += 3;
            } else if (matches[A + 3] === '/' && matches[A + 1] === ' ') { // Check for a complex fraction "123 1/2"
                v = assign(parseNumber(matches[A]), s);
                w = assign(parseNumber(matches[A + 2]), s);
                y = assign(parseNumber(matches[A + 4]), 1);
                A += 5;
            }

            if (matches.length <= A) { // Check for more tokens on the stack
                d = y * z;
                s = /* void */
                    n = x + d * v + z * w;
                // break;
            }
        } else {
            /* Fall through on error */
            // }
            // default:
            throw InvalidParameter();
            // }

        }

    if (d === 0) {
        throw DivisionByZero();
    }

    return {
        s: s < 0 ? -1 : 1,
        n: Math.abs(n),
        d: Math.abs(d)
    };
};

// Creates a new Fraction internally without the need of the bulky constructor
export const newFraction = (n: number, d: number): Fraction => {
    if (d === 0) {
        throw DivisionByZero();
    }
    // let f = Object.create(Fraction.prototype);
    const _s = n < 0 ? -1 : 1;
    n = n < 0 ? -n : n;
    const a = gcd(n, d);
    const _n = n / a;
    const _d = d / a;
    return new Fraction({ n: _n, d: _d, s: _s });
};

export const cycleLen = (n: number, d: number) => {

    for (; d % 2 === 0;
        d /= 2) {
    }

    for (; d % 5 === 0;
        d /= 5) {
    }

    if (d === 1) // Catch non-cyclic numbers
        return 0;

    // If we would like to compute really large numbers quicker, we could make use of Fermat's little theorem:
    // 10^(d-1) % d == 1
    // However, we don't need such large numbers and MAX_CYCLE_LEN should be the capstone,
    // as we want to translate the numbers to strings.

    let rem = 10 % d;
    let t = 1;

    for (; rem !== 1; t++) {
        rem = rem * 10 % d;

        if (t > MAX_CYCLE_LEN)
            return 0; // Returning 0 here means that we don't print it as a cyclic number. It's likely that the answer is `d-1`
    }
    return t;
};

export const cycleStart = (n: number, d: number, len: number) => {

    let rem1 = 1;
    let rem2 = modpow(10, len, d);

    for (let t = 0; t < 300; t++) { // s < ~log10(Number.MAX_VALUE)
        // Solve 10^s == 10^(s+t) (mod d)

        if (rem1 === rem2)
            return t;

        rem1 = rem1 * 10 % d;
        rem2 = rem2 * 10 % d;
    }
    return 0;
};

const modpow = (b: number, e: number, m: number) => {
    let r = 1;
    for (; e > 0; b = (b * b) % m, e >>= 1) {
        if (e & 1) {
            r = (r * b) % m;
        }
    }
    return r;
};
