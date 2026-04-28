import Fraction from "./fraction.js";
import { logger } from "./logger.js";

const MAX_CYCLE_LEN = 2000;

export const DivisionByZero = () => new Error("Division by Zero");
export const InvalidParameter = () => new Error("Invalid argument");
export const NonIntegerParameter = () => new Error("Parameters must be integer");

export const parseNumber = (s: string) => {
    const matches = s.matchAll(/\(\d+\)/g);
    for (const match of matches) {
        // can not parse irrational numbers, like: 0.(3) = 0.333333333333333333...
        logger.debug('Has (). Starts from ', match.index);
        logger.debug(match);
        const repeatN = match[0].replace(/[()]/g, '');
        logger.debug('repeatN = ' + repeatN);

        const decimalPointIndex = s.indexOf('.');
        logger.debug('decimalPointIndex = ' + decimalPointIndex);
        const l = 15 - (match.index - 1 - decimalPointIndex);
        let r = s.substring(0, match.index);
        for (let i = 0; i < l; i++) {
            r += '' + repeatN;
        }
        logger.debug('r = ' + r + ` [${r.length}]`);
        logger.debug('   ' + parseFloat(r));
        return parseFloat(r);
    }


    // logger.debug('parsing number:', s);
    let cs = s.replace(/[^0-9\.-]/g, '');
    // logger.debug('besore parsing number:', cs);
    const r = cs.includes(".") ? parseFloat(cs) : parseInt(cs, 10);
    // logger.debug('result = ', r);
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

export const lcm = (a: number, b: number) => {
    if (!a || !b) return 0;
    return Math.abs(a * b) / gcd(a, b);
};

export const multiplyBy10 = (x: number): number => {
    let sx = `${x}`;
    const pattern = /\./g;
    const matches = pattern.exec(sx);
    if (matches) {
        const naked = sx.replace(pattern, ''); // remove the dot
        const head = naked.substring(0, matches.index + 1);
        const tail = naked.substring(matches.index + 1);
        sx = `${head}.${tail}`;
    }
    return parseFloat(sx);
};

export const convertFloatToFraction = (f: number) => {
    logger.debug('convert Float To Fraction for: ', f);
    let af = Math.abs(f);
    let n = 0;

    while (af % 1 != 0 && n < MAX_CYCLE_LEN) {
        af = multiplyBy10(af);
        n++;
    }
    return simplify(new Fraction({
        numerator: af,
        denominator: Math.pow(10, n),
        sign: f < 0 ? -1 : 1
    }));
};

export const simplify = (frc: Fraction) => {
    const c = gcd(frc.numerator, frc.denominator);
    return new Fraction({
        numerator: frc.numerator / c,
        denominator: frc.denominator / c,
        sign: frc.sign
    });
};

export type ParseData = {
    numerator: number,
    denominator: number,
    sign?: number,
};

export const isParseData = (x: unknown): x is ParseData => {
    logger.debug('Calling isParseData:', x);
    const data = <ParseData>x;
    const hasN = data.hasOwnProperty('numerator') && data.numerator !== undefined && data.numerator !== null;
    const hasD = data.hasOwnProperty('denominator') && data.denominator !== undefined && data.denominator !== null;
    // Also check that values are actual numbers (not empty strings that slipped through)
    const validN = typeof data.numerator === 'number' || (typeof data.numerator === 'string' && data.numerator !== '');
    const validD = typeof data.denominator === 'number' || (typeof data.denominator === 'string' && data.denominator !== '');
    const r = (hasN && hasD && validN && validD);
    return r;
};

export const assign = (n: number, s: number) => {
    if (isNaN(n)) {
        throw InvalidParameter();
    }
    return n * s;
};

// Creates a new Fraction internally without the need of the bulky constructor
export const newFraction = (n: number, d: number): Fraction => {
    if (d === 0) {
        throw DivisionByZero();
    }
    const _s = n < 0 ? -1 : 1;
    n = n < 0 ? -n : n;
    const a = gcd(n, d);
    const _n = n / a;
    const _d = d / a;
    return new Fraction({ numerator: _n, denominator: _d, sign: _s });
};

