import { InvalidParameter, parseNumber } from "../fraction.helper.js";
import Fraction from "../fraction.js";

describe('1-repeating-decimal-places', () => {
    it('Test 1/3 => 0.(3)', () => {
        expect(new Fraction(1, 3).toString(2)).toEqual('0.(3)');
        expect(new Fraction(2, 3).toString(2)).toEqual('0.(6)');
        expect(new Fraction(4, 7).toString(2)).toEqual('0.(571428)');
        expect(new Fraction(22, 7).toString(0)).toEqual('3.(142857)');
    });

    it('Test 0.(3) => 1/3', (done) => {
        try {
            parseNumber('0.(3)');
            fail();
        } catch (error) {
            done();
        }

    });
});
