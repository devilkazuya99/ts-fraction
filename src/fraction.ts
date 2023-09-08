import {
    DivisionByZero,
    convertFloatToFraction,
    isParseData,
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
    add(a: number | string, b?: number) {
        const nf = new Fraction(a, b);
        if (nf.sign < 0) {
            logger.debug('Forward to sub()');
            return this.sub(nf.numerator, nf.denominator);
        }
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
    sub(a: number | string, b?: number) {
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

    };

}
