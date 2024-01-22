const fs = require("fs")
const path = require("path")
const stringify = require("json-stringify-pretty-compact")

const hots = fs.readFileSync(path.join(__dirname, "EDT","hotfix.json"), "utf8")
fs.writeFileSync(path.join(__dirname, "EDT","hotfix.json"), stringify(JSON.parse(hots), { maxLength: 80, indent: 4 }))