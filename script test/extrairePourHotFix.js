const { CallEdt } = require("../EDT/edt.js");
const stringify = require("json-stringify-pretty-compact");
s = 10;
j = 4; // lundi = 0 vendredi = 4
classe = "MPI";
res = CallEdt[classe][s];
console.log(res)
let term = [];
Object.keys(res).forEach((element, index) => {
    const e = res[element]
    term.push([element, e[0][j], e[1]]);
});
let temp = {};
temp[s + "/" + j] = term;
require("fs").writeFileSync(
    "out.json",
    stringify(temp, { maxLength: 80, indent: 4 }),
);
