import {
    DivisionByZero,
    convertFloatToFraction,
    cycleLen, cycleStart,
    isParseData, newFraction,
    parseNumber, simplify
} from "./fraction.helper.js";

const enableDebug = false;
const logger = {
    debug: (...o) => {
        if (enableDebug) {
            console.log(o);
        }
    }
};

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
            this.numerator = param1.numerator;
            this.denominator = param1.denominator;
            this.sign = param1.sign !== undefined ? param1.sign : 1;
        } else if (typeof param1 === "number") {
            this.numerator = param1;
            this.denominator = param2 ? param2 : 1;
            this.sign = 1;
        } else if (typeof param1 === "string") {
            if (param1.includes("/")) {
                const [v1, v2] = param1.split("/");
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
    add(a: number | string | [number, number], b?: number) {
        const P = new Fraction(a, b);
        return newFraction(
            this.sign * this.numerator * P.denominator + P.sign * this.denominator * P.numerator,
            this.denominator * P.denominator);
    }

    /**
    * Subtracts two rational numbers
    *
    * Ex: new Fraction({n: 2, d: 3}).sub("14.9") => -427 / 30
    **/
    sub(a: number | string, b?: number) {
        const P = new Fraction(a, b);
        return newFraction(
            this.sign * this.numerator * P.denominator - P.sign * this.denominator * P.numerator,
            this.denominator * P.denominator
        );
    }

    /**
     * Multiplies two rational numbers
     *
     * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
     **/
    mul(a: number | string | Fraction, b?: number) {
        const P = new Fraction(a, b);
        logger.debug('this = ', this);
        logger.debug('mul:p = ', P);
        return newFraction(
            this.sign * P.sign * this.numerator * P.numerator,
            this.denominator * P.denominator
        );
    }

    /**
     * Divides two rational numbers
     *
     * Ex: new Fraction("-17.(345)").inverse().div(3)
     **/
    div(a: number | string | Fraction, b?: number) {
        const P = new Fraction(a, b);
        return newFraction(
            this.sign * P.sign * this.numerator * P.denominator,
            this.denominator * P.numerator
        );
    }

    /**
       * Creates a string representation of a fraction with all digits
       *
       * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
       **/
    public toString(dec: number): string {
        logger.debug('calling toString(dec: number)');
        let N = this.numerator;
        let D = this.denominator;

        if (isNaN(N) || isNaN(D)) {
            return "NaN";
        }

        dec = dec || 15; // 15 = decimal places when no repetation

        let cycLen = cycleLen(N, D); // Cycle length
        let cycOff = cycleStart(N, D, cycLen); // Cycle start

        let str: string = this.sign < 0 ? "-" : "";

        str += ("" + ((N / D) | 0));
        N %= D;
        N *= 10;

        if (N)
            str += ".";

        if (cycLen) {

            for (let i = cycOff; i--;) {
                str += N / D | 0;
                N %= D;
                N *= 10;
            }
            str += "(";
            for (let i = cycLen; i--;) {
                str += N / D | 0;
                N %= D;
                N *= 10;
            }
            str += ")";
        } else {
            for (let i = dec; N && i--;) {
                str += N / D | 0;
                N %= D;
                N *= 10;
            }
        }
        return str;
    };

}
