import {
    DivisionByZero,
    convertFloatToFraction,
    gcd,
    isParseData,
    lcm,
    newFraction,
    parseNumber,
    simplify
} from "./fraction.helper.js";
import { logger } from "./logger.js";

export type FractionParam =
    | string
    | number
    | [number, number]
    | Fraction
    | { numerator: number; denominator: number; sign?: number; }
    | boolean
    | null;


export default class Fraction {
    numerator: number;
    denominator: number;
    sign: number = 1;

    constructor(param1: FractionParam, param2?: number) {
        logger.debug("constructing new Fraction", param1, param2);
        if (param1 instanceof Fraction) {
            this.numerator = param1.numerator;
            this.denominator = param1.denominator;
            this.sign = param1.sign;
        } else if (isParseData(param1)) {
            logger.debug('Construct by object.');
            this.numerator = param1.numerator;
            this.denominator = param1.denominator;
            this.sign = param1.sign !== undefined ? param1.sign : 1;
            logger.debug('result', this);
        } else if (typeof param1 === "number") {
            this.numerator = param1;
            this.denominator = param2 ? param2 : 1;
            this.sign = (this.numerator / this.denominator) >= 0 ? 1 : -1;
        } else if (typeof param1 === "string") {
            if (param1.includes("/")) {
                const [v1, v2] = param1.split("/");
                this.numerator = parseNumber(v1);
                this.denominator = parseNumber(v2);
                this.sign = v1.includes('-') ? -1 : 1;
            } else if (param1.includes(":")) {
                const [v1, v2] = param1.split(":");
                this.numerator = parseNumber(v1);
                this.denominator = parseNumber(v2);
                this.sign = v1.includes('-') ? -1 : 1;
            } else {
                logger.debug('use this route.');
                let f: Fraction;
                if (param2 == undefined) {
                    f = convertFloatToFraction(parseNumber(param1));
                } else {
                    f = simplify(new Fraction({ numerator: parseNumber(param1), denominator: param2 }));
                }
                this.numerator = f.numerator;
                this.denominator = f.denominator;
                this.sign = f.sign;
            }
        } else if (Array.isArray(param1)) {
            const v1 = param1[0];
            const v2 = param1[1];
            this.numerator = typeof v1 === "string" ? parseNumber(v1) : v1;
            this.denominator = typeof v2 === "string" ? parseNumber(v2) : v2;
            this.sign = 1;
        } else {
            logger.debug('I got here somehow...');
            this.numerator = 0;
            this.denominator = 1;
            this.sign = 1;
        }
        if (this.denominator === 0) {
            throw DivisionByZero();
        }
    }

    /**
     * Adds two rational numbers
     *
     * Ex: new Fraction({n: 2, d: 3}).add("14.9") => 467 / 30
     **/
    add(a: number | string | Fraction, b?: number) {
        const nf = new Fraction(a, b);
        // const newSign = this.sign * nf.sign;
        let partN1 = 0;
        let partN2 = 0;
        if (this.sign < 0) {
            partN1 = -(this.numerator * nf.denominator);
        } else {
            partN1 = (this.numerator * nf.denominator);
        }
        if (nf.sign < 0) {
            partN2 = -(nf.numerator * this.denominator);
        } else {
            partN2 = (nf.numerator * this.denominator);
        }
        const newN = partN1 + partN2;
        const newSign = newN < 0 ? -1 : 1;
        const newD = this.denominator * nf.denominator;
        logger.debug('done add.');
        const answer = new Fraction({
            numerator: Math.abs(newN),
            denominator: Math.abs(newD),
            sign: newSign
        });
        return answer;
        // return newFraction(
        //     this.sign * this.numerator * nf.denominator + nf.sign * this.denominator * nf.numerator,
        //     this.denominator * nf.denominator);
    }

    /**
    * Subtracts two rational numbers
    *
    * Ex: new Fraction({n: 2, d: 3}).sub("14.9") => -427 / 30
    **/
    sub(a: number | string | Fraction, b?: number) {
        const nf = new Fraction(a, b);
        let partN1 = 0;
        let partN2 = 0;
        if (this.sign < 0) {
            partN1 = -(this.numerator * nf.denominator);
        } else {
            partN1 = (this.numerator * nf.denominator);
        }
        if (nf.sign < 0) {
            partN2 = -(nf.numerator * this.denominator);
        } else {
            partN2 = (nf.numerator * this.denominator);
        }
        logger.debug(`${partN1} - ${partN2}`);

        const newN = partN1 - partN2;
        const newD = this.denominator * nf.denominator;
        logger.debug(newD);
        const newSign = (newN * newD) < 0 ? -1 : 1;

        logger.debug('done subtract.');
        const answer = new Fraction({
            numerator: Math.abs(newN),  // must not have sig
            denominator: Math.abs(newD),  // must not have sig
            sign: newSign
        });
        return answer;
    }

    /**
     * Multiplies two rational numbers
     *
     * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
     **/
    mul(a: number | string | Fraction, b?: number) {
        const nF = new Fraction(a, b);
        logger.debug('🍎 this = ', this);
        logger.debug('🍎 mul:p = ', nF);
        // result N / D = (s1 * s2)[(n1 * n2) / (d1 * d2)]
        const newN = this.numerator * nF.numerator;
        const newD = this.denominator * nF.denominator;
        const newSign = this.sign * nF.sign;

        logger.debug('done multiply.');
        const answer = new Fraction({
            numerator: Math.abs(newN),  // must not have sig
            denominator: Math.abs(newD),  // must not have sig
            sign: newSign
        });
        logger.debug('🍎 answer = ', answer);
        return answer;
    }

    /**
     * Divides two rational numbers
     *
     * Ex: new Fraction("-17.(345)").inverse().div(3)
     **/
    div(a: number | string | Fraction, b?: number) {
        const nF = new Fraction(a, b);
        logger.debug('🍏 this = ', this);
        logger.debug('🍏 div:p = ', nF);
        if (nF.numerator === 0) {
            throw DivisionByZero();
        }
        // result N / D = (s1 * s2)[(n1 * n2) / (d1 * d2)]
        const newN = this.numerator * nF.denominator;
        const newD = this.denominator * nF.numerator;
        const newSign = this.sign * nF.sign;

        logger.debug('done divide.');
        const answer = new Fraction({
            numerator: Math.abs(newN),  // must not have sig
            denominator: Math.abs(newD),  // must not have sig
            sign: newSign
        });
        logger.debug('🍏 answer = ', answer);
        return answer;
    }

    /**
     * Returns the absolute value of the fraction
     *
     * Ex: new Fraction({ numerator: -222, denominator: 3 }).abs() => 74
     **/
    abs() {
        return new Fraction({
            numerator: this.numerator,
            denominator: this.denominator,
            sign: 1
        });
    }

    /**
     * Returns the negated value of the fraction
     *
     * Ex: new Fraction("1/3").neg() => -0.(3)
     **/
    neg() {
        return new Fraction({
            numerator: this.numerator,
            denominator: this.denominator,
            sign: -this.sign
        });
    }

    /**
     * Returns the inverse (reciprocal) of the fraction
     *
     * Ex: new Fraction("2/7").inverse() => 3.5
     **/
    inverse() {
        if (this.numerator === 0) {
            throw DivisionByZero();
        }
        return new Fraction({
            numerator: this.denominator,
            denominator: this.numerator,
            sign: this.sign
        });
    }

    /**
     * Returns the result of a^b (power)
     *
     * Ex: new Fraction(27).pow("2/3") => 9
     **/
    pow(exp: number | string | Fraction) {
        const nF = new Fraction(exp);

        if (this.numerator === 0 && nF.numerator === 0) {
            return new Fraction(1); // 0^0 = 1
        }

        if (nF.denominator === 1) {
            // Integer exponent
            const result = Math.pow(this.sign * this.numerator / this.denominator, nF.sign * nF.numerator);
            if (Number.isInteger(result)) {
                return new Fraction(result);
            }
            // For integer exponents, compute exactly
            const newN = Math.pow(this.numerator, nF.numerator);
            const newD = Math.pow(this.denominator, nF.numerator);
            const newSign = nF.numerator % 2 === 0 ? 1 : this.sign;
            if (nF.sign < 0) {
                // Negative exponent => reciprocal
                return new Fraction({
                    numerator: Math.pow(this.denominator, nF.numerator),
                    denominator: Math.pow(this.numerator, nF.numerator),
                    sign: newSign
                });
            }
            return new Fraction({
                numerator: newN,
                denominator: newD,
                sign: newSign
            });
        }

        // Fractional exponent: a^(p/q) = (a^p)^(1/q)
        const base = this.sign * this.numerator / this.denominator;
        const expVal = nF.sign * nF.numerator / nF.denominator;
        const result = Math.pow(base, expVal);

        if (isNaN(result) || !isFinite(result)) {
            return new Fraction({ numerator: NaN, denominator: NaN });
        }

        return convertFloatToFraction(result);
    }

    /**
     * Returns the modulo (remainder) of the fraction divided by n
     *
     * Ex: new Fraction(4.55).mod(0.05) => 0
     **/
    mod(a: number | string | Fraction) {
        const nF = new Fraction(a);
        if (nF.numerator === 0) {
            throw DivisionByZero();
        }
        // a mod b = a - b * floor(a / b)
        const quotient = this.div(nF);
        const floorQuotient = quotient.floor();
        const result = this.sub(nF.mul(floorQuotient));
        return result;
    }

    /**
     * Returns the greatest common divisor of two fractions
     *
     * Ex: new Fraction(52).gcd(39) => 13
     **/
    gcd(a: number | string | Fraction) {
        const nF = new Fraction(a);
        // gcd of fractions: gcd(a/b, c/d) = gcd(a, c) / lcm(b, d)
        const numGcd = gcd(this.numerator, nF.numerator);
        const denLcm = lcm(this.denominator, nF.denominator);
        return new Fraction({
            numerator: numGcd,
            denominator: denLcm,
            sign: 1
        });
    }

    /**
     * Returns the least common multiple of two fractions
     *
     * Ex: new Fraction(200).lcm(333) => 66600
     **/
    lcm(a: number | string | Fraction) {
        const nF = new Fraction(a);
        // lcm of fractions: lcm(a/b, c/d) = lcm(a, c) / gcd(b, d)
        const numLcm = lcm(this.numerator, nF.numerator);
        const denGcd = gcd(this.denominator, nF.denominator);
        return new Fraction({
            numerator: numLcm,
            denominator: denGcd,
            sign: 1
        });
    }

    /**
     * Returns the ceiling of the fraction
     *
     * Ex: new Fraction(0.4).ceil() => 1
     * Ex: new Fraction(0.23).ceil(2) => 0.23
     **/
    ceil(places?: number) {
        const value = this.sign * this.numerator / this.denominator;
        if (places !== undefined && places !== null) {
            const factor = Math.pow(10, places);
            const rounded = Math.ceil(value * factor) / factor;
            return convertFloatToFraction(rounded);
        }
        return new Fraction(Math.ceil(value));
    }

    /**
     * Returns the floor of the fraction
     *
     * Ex: new Fraction(0.4).floor() => 0
     * Ex: new Fraction(0.4).floor(1) => 0.4
     **/
    floor(places?: number) {
        const value = this.sign * this.numerator / this.denominator;
        if (places !== undefined && places !== null) {
            const factor = Math.pow(10, places);
            const rounded = Math.floor(value * factor) / factor;
            return convertFloatToFraction(rounded);
        }
        return new Fraction(Math.floor(value));
    }

    /**
     * Returns the rounded value of the fraction
     *
     * Ex: new Fraction(10.4).round() => 10
     * Ex: new Fraction(10.5).round() => 11
     **/
    round(places?: number) {
        const value = this.sign * this.numerator / this.denominator;
        if (places !== undefined && places !== null) {
            const factor = Math.pow(10, places);
            const rounded = Math.round(value * factor) / factor;
            return convertFloatToFraction(rounded);
        }
        return new Fraction(Math.round(value));
    }

    /**
     * Checks if two fractions are equal
     *
     * Ex: new Fraction(-19.6).equals('-19.6') => true
     **/
    equals(a: number | string | Fraction) {
        const nF = new Fraction(a);
        return this.sign * this.numerator * nF.denominator === nF.sign * nF.numerator * this.denominator;
    }

    /**
     * Compares two fractions. Returns -1 if this < a, 0 if equal, 1 if this > a
     *
     * Ex: new Fraction(3.5).compare(4.1) => -1
     **/
    compare(a: number | string | Fraction) {
        const nF = new Fraction(a);
        const diff = this.sub(nF);
        if (diff.numerator === 0) return 0;
        return diff.sign < 0 ? -1 : 1;
    }

    /**
     * Checks if this fraction is divisible by n
     *
     * Ex: new Fraction(100.5).divisible('1.5') => true
     **/
    divisible(a: number | string | Fraction) {
        const nF = new Fraction(a);
        if (nF.numerator === 0) return false;
        const quotient = this.div(nF);
        // Check if quotient is an integer
        return quotient.denominator === 1;
    }

    /**
     * Returns the value of the fraction as a number
     *
     * Ex: new Fraction(3, 4).valueOf() => 0.75
     **/
    valueOf(): number {
        return this.sign * this.numerator / this.denominator;
    }

    /**
     * Returns a LaTeX string representation of the fraction
     *
     * Ex: new Fraction(3, 4).toLatex() => "\\frac{3}{4}"
     **/
    toLatex(excludeWhole: boolean = false): string {
        if (this.denominator === 1) {
            return `${this.sign < 0 ? '-' : ''}${this.numerator}`;
        }
        const signStr = this.sign < 0 ? '-' : '';
        if (!excludeWhole && this.numerator >= this.denominator) {
            const whole = Math.floor(this.numerator / this.denominator);
            const remainder = this.numerator % this.denominator;
            if (remainder === 0) {
                return `${signStr}${whole}`;
            }
            return `${signStr}${whole}\\frac{${remainder}}{${this.denominator}}`;
        }
        return `${signStr}\\frac{${this.numerator}}{${this.denominator}}`;
    }

    /**
     * Returns a string representation as a fraction
     *
     * Ex: new Fraction(3, 4).toFraction() => "3/4"
     * Ex: new Fraction(71, 23).toFraction(true) => "3 2/23"
     **/
    toFraction(excludeWhole: boolean = false): string {
        const signStr = this.sign < 0 ? '-' : '';
        if (this.numerator === 0) {
            return '0';
        }
        if (this.denominator === 1) {
            return `${signStr}${this.numerator}`;
        }
        if (!excludeWhole && this.numerator >= this.denominator) {
            const whole = Math.floor(this.numerator / this.denominator);
            const remainder = this.numerator % this.denominator;
            if (remainder === 0) {
                return `${signStr}${whole}`;
            }
            return `${signStr}${whole} ${remainder}/${this.denominator}`;
        }
        return `${signStr}${this.numerator}/${this.denominator}`;
    }

    /**
     * Returns the continued fraction representation as an array
     *
     * Ex: new Fraction(22, 7).toContinued() => [3, 7]
     **/
    toContinued(): number[] {
        let n = this.numerator;
        let d = this.denominator;
        const result: number[] = [];

        while (d !== 0) {
            const whole = Math.floor(n / d);
            result.push(whole);
            const remainder = n % d;
            n = d;
            d = remainder;
        }

        return result;
    }

    /**
     * Creates a clone of the fraction
     **/
    clone(): Fraction {
        return new Fraction({
            numerator: this.numerator,
            denominator: this.denominator,
            sign: this.sign
        });
    }

    /**
     * Simplifies the fraction (reduces to lowest terms)
     *
     * Ex: new Fraction(9, 12).simplify() => 3/4
     **/
    simplify(eps?: number): Fraction {
        return simplify(this);
    }

    /**
     * Creates a string representation of a fraction with all digits
     *
     * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
     **/
    public toString(decimalPlace?: number): string {
        logger.debug('🚑 calling toString()', this);
        decimalPlace = decimalPlace ? decimalPlace : 15;
        // decimalPlace++;
        let N = this.numerator;
        let D = this.denominator;

        if (isNaN(N) || isNaN(D)) {
            return "NaN";
        }

        const divResult = '' + (N / D);
        let str = (
            (this.sign < 0 ? "-" : "") +
            (divResult.match(/[e]/g) ? (N / D).toFixed(decimalPlace + 2) : (N / D))
        );
        logger.debug('🚑 original str =', str);
        logger.debug('🚑 str.length =', str.length);

        const parts = str.split('.');
        if (parts.length > 1) {
            let decimalPart = parts[1];
            if (decimalPart.length > decimalPlace) {
                str = ('' + parseFloat(str).toFixed(decimalPlace + 2));
                str = str.substring(0, str.length - 2);  // hack. doant want to round the decimal point to detect Irrational Numbers later.
                logger.debug('🚑 trimmed str =', str);
                logger.debug('🚑 str.length =', str.length);
            } else {
                logger.debug('🚑 Appending decimal point.');
                while (decimalPart.length < decimalPlace) {
                    decimalPart += '0';
                }
                logger.debug('🚑 decimalPart = ', decimalPart);
                str = parts[0] + '.' + decimalPart;
            }
        } else {
            logger.debug('🚑 no decimal point');
            return str;
        }

        const matches = str.matchAll(/(\d+?)\1+/gm);

        let group = '';
        let repeat = '';
        let beginIndex = -1;
        for (const match of matches) {
            logger.debug('>', match);
            group = match[0];
            repeat = match[1];
            beginIndex = match.index;
        }
        if (beginIndex >= 0) {

            logger.debug('🥩 str.length =', str.length);
            logger.debug('🥩 group =', group);
            logger.debug('🥩 repeat =', repeat);
            logger.debug('🥩 str.lastIndexOf(repeat) =', str.lastIndexOf(repeat));
            logger.debug('🥩 str.lastIndexOf(group) =', str.lastIndexOf(group));
            logger.debug('🥩 is repeat till the end =', str.lastIndexOf(group) + group.length);

            let doFormat = false;
            if (repeat.length === 1) {
                if ((str.lastIndexOf(group) + group.length) === str.length) {
                    doFormat = true;
                }
            } else {
                const arr = str.split(repeat);
                let lastItem = arr[arr.length - 1];
                lastItem = lastItem.substring(0, lastItem.length - 1);
                if (repeat.startsWith(lastItem)) {
                    doFormat = true;
                }
            }

            if (doFormat) {
                const head = str.substring(0, beginIndex);
                logger.debug('🥩 head = ' + head);
                const result = repeat === '0' ? head : `${head}(${repeat})`;
                logger.debug('🥩 result = ' + result);
                if (result.endsWith('.')) {
                    return result.replace(/[.]/, '');
                }
                return result;
            }
        }
        return str;

    }

}
