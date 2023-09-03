import { assign, convertFloatToFraction, gcd, isParseData } from "./fraction.helper.js";
import Fraction from "./fraction.js";
import { logger } from "./logger.js";

describe('fraction.helper', () => {

    it('assign', () => {
        expect(assign(3, 4)).toBe(12);
    });

    [
        [{ a: '' }, false],
        [{ denominator: '', numerator: '', sign: '' }, false],
        [{ sign: 3, numerator: 3 }, false],
        [{ numerator: 3, denominator: 5 }, true]
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
        logger.debug(frc);
        expect(frc).toEqual(jasmine.objectContaining({ sign: 1, numerator: 1571, denominator: 500 }));
    });

    it('convertFloatToFraction', () => {
        const frc = convertFloatToFraction(-17.345);
        logger.debug(frc);
        expect(frc).toEqual(jasmine.objectContaining({ sign: -1, numerator: 3469, denominator: 200 }));
    });

});
