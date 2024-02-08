const {allEdt} = require("./edt.js")
const stringify = require("json-stringify-pretty-compact")
s = 19
j = 4
res = allEdt[s]
let term = []
res.forEach((element,index) => {
    if (index+1 != 10)  return
    term.push([(index + 1).toString(), element[0][j], element[1]])
});
let temp = {}
temp[s+"/"+j] = term
require("fs").writeFileSync("out.json", stringify(temp, { maxLength: 80, indent: 4 }))