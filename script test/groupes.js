const fs = require("fs")
// const stringify = require("json-stringify-pretty-compact")
const g1 = JSON.parse(fs.readFileSync("./EDT/MP2I/s1/groupes.json").toString())
const g2 = JSON.parse(fs.readFileSync("./EDT/MP2I/s2/groupes.json").toString())
let g2names = []
let out = {}
for (let i = 0; i < g2.length; i++) {
    for (let j = 0; j < g2[i].length; j++) {
        const name = g2[i][j];
        console.log(name)
        g2names.push(name[1]+" "+name[0]+".")
    }
}



for (let i = 0; i < g1.length; i++) {
    for (let j = 0; j < g1[i].length; j++) {
        const name = g1[i][j];
        const fname = name[1] + " " + name[0] + "."
        if (g2names.includes(fname)) out[fname] = [i+1]
    }
}
for (let i = 0; i < g2.length; i++) {
    for (let j = 0; j < g2[i].length; j++) {
        const name = g2[i][j];
        const fname = name[1] + " " + name[0] + "."
        out[fname].push(i + 1)
    }
}
fs.writeFileSync("groupes.json", JSON.stringify(out)) // , { maxLength: 80, indent: 4 }