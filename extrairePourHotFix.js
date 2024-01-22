const {allEdt} = require("./edt.js")
const stringify = require("json-stringify-pretty-compact")
s = 18
j = 0
res = allEdt[s]
let term = []
res.forEach((element,index) => {
    term.push([(index+1).toString(),element[j]])
});
let temp = {}
temp[s+"/"+j] = term
require("fs").writeFileSync("out.json", stringify(temp, { maxLength: 80, indent: 4 }))