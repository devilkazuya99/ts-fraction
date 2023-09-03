import Fraction from "./fraction.js";
import { logger } from "./logger.js";
import { TestsDataset } from "./tests/test-dataset.js";

describe('Fraction', () => {

    ['add'].forEach(fnName => {
        TestsDataset.filter(testData => testData.fn === fnName).forEach(testData => {
            fit(`Testing '${fnName}': ${testData.label}.`, () => {
                logger.debug(`Testing '${fnName}': ${testData.label}.`);
                console.log(`>>> `, testData);
                const { set, set2, param, fn, expectError } = { ...testData };
                const expected = testData.expect;
                let fraction: Fraction;
                if (set2) {
                    fraction = new Fraction(set, set2);
                } else {
                    fraction = new Fraction(testData.set);
                }
                const result = (<Fraction>fraction[fn](param)).toString(15);
                expect(result).toEqual(expected as string);
            });
        });
    });

    it('construct Fraction({ n: 3, d: 6 })', () => {
        const frc = new Fraction({ numerator: 3, denominator: 6 });
        expect(frc).toBeTruthy();
        logger.debug('Fraction.toString() = ' + frc.toString(2));
    });

    it('construct Fraction(4, 5)', () => {
        const frc = new Fraction(4, 5);
        expect(frc).toBeTruthy();
        logger.debug('Fraction.toString() = ' + frc.toString(3));
    });

    it('construct Fraction(\'3/4\')', () => {
        const frc = new Fraction('3/4');
        expect(frc).toBeTruthy();
        logger.debug('Fraction.toString() = ' + frc.toString(4));
    });

    it('add', () => {
        const frc = new Fraction({ numerator: 2, denominator: 3 })['add']("14.9");
        expect(frc).toBeTruthy();
        logger.debug('Fraction.add() = ', frc);
        expect(frc).toEqual(jasmine.objectContaining({ numerator: 467, sign: 1, denominator: 30 }));
    });

    it('sub', () => {
        const frc = new Fraction({ numerator: 2, denominator: 3 })['sub']("14.9");
        expect(frc).toBeTruthy();
        logger.debug('Fraction.sub() = ', frc);
        // expect(frc).toEqual(jasmine.objectContaining({ n: 467, s: 1, d: 30 }));
    });

    it('toString', () => {
        const frc = new Fraction(1)['sub']("2");
        expect(frc).toBeTruthy();
        logger.debug('Fraction.sub() = ', frc);
        logger.debug(frc.toString(2));
        // expect(frc).toEqual(jasmine.objectContaining({ n: 467, s: 1, d: 30 }));
    });

    // expect new Fraction("-17.(345)").mul(3) => 5776 / 111
    it('mul', () => {
        const frc = new Fraction("-17.345");
        expect(frc).toBeTruthy();
        logger.debug('Fraction = ', frc);
        expect(frc).toEqual(jasmine.objectContaining({ numerator: 3469, sign: -1, denominator: 200 }));
        const r = frc.mul("3");
        logger.debug('Fraction.sub(3) = ', r);
    });

    it('sub', () => {
        const frc = new Fraction({ numerator: 2, denominator: 3 })['sub']("14.9");
        expect(frc).toBeTruthy();
        logger.debug('Fraction.sub() = ', frc);
        // expect(frc).toEqual(jasmine.objectContaining({ n: 467, s: 1, d: 30 }));
    });

    //Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
    it('mul', () => {
        const frc = new Fraction("3/4").mul(3);
        logger.debug('mul:Fraction = ', frc);
    });

    it('mul', () => {
        const frc = new Fraction(1, 98).mul(98);
        logger.debug('mul:Fraction = ', frc);
    });

    it('div', () => {
        const frc = new Fraction("30/7").div(2);
        logger.debug('div:Fraction = ', frc, frc.toString(9));
    });

});
