const fs = require("fs")
const path = require("path")
const pathToFolder = path.join(__dirname, "logs")


 
const getLast50 = () => {
    let s = fs.readdirSync(pathToFolder)
    s = s.reverse()
    let logs = []
    let n = 0
    s.forEach(e => {
        if (n >= 50) return
        if (!e.startsWith("connections ")) return
        let data = JSON.parse(fs.readFileSync(path.join(pathToFolder,e)))
        const tmp = data.slice(-(50-n))
        // tmp.forEach(e => console.log(e.length))
        // console.log(data[0])
        tmp.reverse()
        logs = logs.concat(tmp)

        n += tmp.length
    })
    return logs
}

// let d = getLast50()
// console.log(d, d.length)

module.exports = getLast50