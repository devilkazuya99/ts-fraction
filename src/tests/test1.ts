const sx = '100076917749461498149173113687137631791146711';

const pattern = /11/g;
const regex = new RegExp('11', 'g');

const arr1 = sx.match(pattern);
const arr2 = sx.match(regex);


console.log(arr1?.length);
console.log(arr2?.length);


const s2 = '3.42(4)';
const pt1 = /\(\d+\)$/g;
const arr3 = s2.match(pt1);
console.log(arr3);
if (arr3) {
    for (let d of arr3) {
        console.log(d.replace(/[()]/g, ''));
    }
}

console.log(`test parseNumber`);
const s = '99.(9)';
// const s = '0.(3)';
const matches = s.matchAll(/\(\d+\)/g);
for (const match of matches) {
    // can not parse irrational numbers, like: 0.(3) = 0.333333333333333333...
    console.log('Has (). Starts from ', match.index);
    console.log(match);
    const repeatN = match[0].replace(/[()]/g, '');
    console.log('repeatN = ' + repeatN);

    const decimalPointIndex = s.indexOf('.');
    console.log('decimalPointIndex = ' + decimalPointIndex);
    const l = 15 - (match.index - 1 - decimalPointIndex);
    let r = s.substring(0, match.index);
    for (let i = 0; i < l; i++) {
        r += '' + repeatN;
    }
    console.log('r = ' + r + ` [${r.length}]`);
    console.log('   ' + parseFloat(r));

}
