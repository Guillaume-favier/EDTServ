const { allEdt } = require("./edt.js");
const stringify = require("json-stringify-pretty-compact");
s = 29;
j = 2;
res = allEdt[s];
console.log(allEdt)
let term = [];
res.forEach((element, index) => {
    console.log(element)
    term.push([(index + 1).toString(), element[0][j], element[1]]);
});
let temp = {};
temp[s + "/" + j] = term;
require("fs").writeFileSync(
    "out.json",
    stringify(temp, { maxLength: 80, indent: 4 }),
);
