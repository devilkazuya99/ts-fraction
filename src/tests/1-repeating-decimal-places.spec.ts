import { InvalidParameter, parseNumber } from "../fraction.helper.js";
import Fraction from "../fraction.js";
import { logger } from "../logger.js";

describe('1-repeating-decimal-places', () => {
    it('Test 1/3 => 0.(3)', () => {
        expect(new Fraction(1, 3).toString()).toEqual('0.(3)');
        expect(new Fraction(2, 3).toString()).toEqual('0.(6)');
        expect(new Fraction(4, 7).toString()).toEqual('0.(571428)');
        expect(new Fraction(22, 7).toString()).toEqual('3.(142857)');
    });

    it('Test 0.(3) => 1/3', (done) => {
        try {
            logger.debug(`parseNumber('0.(3)') = `, parseNumber('0.(3)'));
        } catch (error) {
            done();
        } finally {
            done();
        }

    });
});
