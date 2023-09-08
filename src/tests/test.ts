import Fraction from "../fraction.js";

console.log('Hello World');

const fraction = new Fraction('17402216385200408/5539306332998545');
console.log(fraction);
console.log(fraction.toString());
// const result = fraction.add('-5');
// console.log('test result =', result);
// console.log(result.toString());

// const s = '0.003333333333';




const format = (str: string) => {
    const matches = str.matchAll(/(\d+?)\1+/gm);

    let group = '';
    let repeat = '';
    let beginIndex = -1;
    for (const match of matches) {
        console.log('match >', match);
        group = match[0];
        repeat = match[1];
        beginIndex = match.index;
    }
    if (beginIndex >= 0) {

        console.log('-----------------------------------------');
        console.log('str.length =', str.length);
        console.log('group =', group);
        console.log('repeat =', repeat);
        console.log('str.lastIndexOf(repeat) =', str.lastIndexOf(repeat));
        console.log('str.lastIndexOf(group) =', str.lastIndexOf(group));
        console.log('is repeat till the end =', str.lastIndexOf(group) + group.length);

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
            const result = repeat === '0' ? head : `${head}(${repeat})`;
            console.log('result = ' + result);
            return result;
        }
    }
    return str;
};

// const s = '4.285714285714286';
// console.log(format(s));


