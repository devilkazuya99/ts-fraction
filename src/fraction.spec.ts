import Fraction, { FractionParam } from "./fraction.js";
import { TestsDataset } from "./test-dataset.js";

describe('Fraction', () => {

    ['add'].forEach(fnName => {
        TestsDataset.filter(testData => testData.fn === fnName).forEach(testData => {
            it(`Testing '${fnName}' function.`, () => {
                console.log(`>>> `, testData);
            });
        });
    });

    it('construct Fraction({ n: 3, d: 6 })', () => {
        const frc = new Fraction({ numerator: 3, denominator: 6 });
        expect(frc).toBeTruthy();
        console.log('Fraction.toString() = ' + frc.toString(2));
    });

    it('construct Fraction(4, 5)', () => {
        const frc = new Fraction(4, 5);
        expect(frc).toBeTruthy();
        console.log('Fraction.toString() = ' + frc.toString(3));
    });

    it('construct Fraction(\'3/4\')', () => {
        const frc = new Fraction('3/4');
        expect(frc).toBeTruthy();
        console.log('Fraction.toString() = ' + frc.toString(4));
    });

    it('add', () => {
        const frc = new Fraction({ numerator: 2, denominator: 3 })['add']("14.9");
        expect(frc).toBeTruthy();
        console.log('Fraction.add() = ', frc);
        expect(frc).toEqual(jasmine.objectContaining({ n: 467, s: 1, d: 30 }));
    });

    it('sub', () => {
        const frc = new Fraction({ numerator: 2, denominator: 3 })['sub']("14.9");
        expect(frc).toBeTruthy();
        console.log('Fraction.sub() = ', frc);
        // expect(frc).toEqual(jasmine.objectContaining({ n: 467, s: 1, d: 30 }));
    });

    it('toString', () => {
        const frc = new Fraction(1)['sub']("2");
        expect(frc).toBeTruthy();
        console.log('Fraction.sub() = ', frc);
        console.log(frc.toString(2));
        // expect(frc).toEqual(jasmine.objectContaining({ n: 467, s: 1, d: 30 }));
    });

    // expect new Fraction("-17.(345)").mul(3) => 5776 / 111
    it('mul', () => {
        const frc = new Fraction("-17.345");
        expect(frc).toBeTruthy();
        console.log('Fraction = ', frc);
        expect(frc).toEqual(jasmine.objectContaining({ n: 3469, s: -1, d: 200 }));
        const r = frc.mul("3");
        console.log('Fraction.sub(3) = ', r);
    });

    it('sub', () => {
        const frc = new Fraction({ numerator: 2, denominator: 3 })['sub']("14.9");
        expect(frc).toBeTruthy();
        console.log('Fraction.sub() = ', frc);
        // expect(frc).toEqual(jasmine.objectContaining({ n: 467, s: 1, d: 30 }));
    });

    //Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
    it('mul', () => {
        const frc = new Fraction("3/4").mul(3);
        console.log('mul:Fraction = ', frc);
    });

    it('mul', () => {
        const frc = new Fraction(1, 98).mul(98);
        console.log('mul:Fraction = ', frc);
    });

    it('div', () => {
        const frc = new Fraction("30/7").div(2);
        console.log('div:Fraction = ', frc, frc.toString(9));
    });

});
