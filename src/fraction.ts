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
    | { s?: number; n: number; d: number; }
    | boolean
    | null;


export default class Fraction {
    s: number = 1;
    n: number;
    d: number;
    constructor(param1: FractionParam, param2?: number) {
        logger.debug("constructing new Fraction", param1, param2);
        if (param1 instanceof Fraction) {
            this.n = param1.n;
            this.d = param1.d;
            this.s = param1.s;
        } else if (isParseData(param1)) {
            this.n = param1.n;
            this.d = param1.d;
            this.s = param1.s !== undefined ? param1.s : 1;
        } else if (typeof param1 === "number") {
            this.n = param1;
            this.d = param2 ? param2 : 1;
            this.s = 1;
        } else if (typeof param1 === "string") {
            if (param1.includes("/")) {
                const [v1, v2] = param1.split("/");
                this.n = parseNumber(v1);
                this.d = parseNumber(v2);
                this.s = v1.includes('-') ? -1 : 1;
            } else {
                logger.debug('use this route.');
                let f: Fraction;
                if (param2 == undefined) {
                    f = convertFloatToFraction(parseNumber(param1));
                } else {
                    f = simplify(new Fraction({ n: parseNumber(param1), d: param2 }));
                }
                this.n = f.n;
                this.d = f.d;
                this.s = f.s;
            }
        } else if (Array.isArray(param1)) {
            const v1 = param1[0];
            const v2 = param1[1];
            this.n = typeof v1 === "string" ? parseNumber(v1) : v1;
            this.d = typeof v2 === "string" ? parseNumber(v2) : v2;
            this.s = 1;
        } else {
            this.n = 0;
            this.d = 1;
            this.s = 1;
        }
        if (this.d === 0) {
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
            this.s * this.n * P.d + P.s * this.d * P.n,
            this.d * P.d);
    }

    /**
    * Subtracts two rational numbers
    *
    * Ex: new Fraction({n: 2, d: 3}).sub("14.9") => -427 / 30
    **/
    sub(a: number | string, b?: number) {
        const P = new Fraction(a, b);
        return newFraction(
            this.s * this.n * P.d - P.s * this.d * P.n,
            this.d * P.d
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
            this.s * P.s * this.n * P.n,
            this.d * P.d
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
            this.s * P.s * this.n * P.d,
            this.d * P.n
        );
    }

    /**
       * Creates a string representation of a fraction with all digits
       *
       * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
       **/
    public toString(dec: number): string {
        logger.debug('calling toString(dec: number)');
        let N = this.n;
        let D = this.d;

        if (isNaN(N) || isNaN(D)) {
            return "NaN";
        }

        dec = dec || 15; // 15 = decimal places when no repetation

        let cycLen = cycleLen(N, D); // Cycle length
        let cycOff = cycleStart(N, D, cycLen); // Cycle start

        let str: string = this.s < 0 ? "-" : "";

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
