const fs = require("fs")
const path = require("path")

const data = JSON.parse(fs.readFileSync("tempGroupes.json","utf-8"))
// console.log(data["result"])
data["results"].forEach(pers => {
    console.log(pers.firstName + " " + pers.lastName[0]+".")
});