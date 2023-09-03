import { assign, convertFloatToFraction, gcd, isParseData } from "./fraction.helper.js";
import Fraction from "./fraction.js";

describe('fraction.helper', () => {

    it('assign', () => {
        expect(assign(3, 4)).toBe(12);
    });

    [
        [{ a: '' }, false],
        [{ d: '', n: '', s: '' }, false],
        [{ s: 3, n: 3 }, false],
        [{ n: 3, d: 5 }, true]
    ].forEach(([x, e]) => {
        it(`isParseData: ${JSON.stringify(x)}`, () => {
            expect(isParseData(x)).toBe(e as boolean);
        });
    });

    it('gcd', () => {
        expect(gcd(17345, 1000)).toEqual(5);
    });

    it('convertFloatToFraction', () => {
        const frc = convertFloatToFraction(3.142);
        console.log(frc);
        expect(frc).toEqual(jasmine.objectContaining({ s: 1, n: 1571, d: 500 }));
    });

    it('convertFloatToFraction', () => {
        const frc = convertFloatToFraction(-17.345);
        console.log(frc);
        expect(frc).toEqual(jasmine.objectContaining({ s: -1, n: 3469, d: 200 }));
    });

    it('parse', () => {
        const frc = new Fraction("-17.(345)");
        console.log("-17.(345) --> ", frc);
        const frc2 = new Fraction("-17.(345)");
        console.log('frc2 = ', frc2);
        console.log(frc2.toString(4));
    });

});
