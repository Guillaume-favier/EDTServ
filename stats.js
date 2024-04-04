const fs = require("fs")
const path = require("path")
const pathToFolder = path.join(__dirname, "logs")


const getInteractionsForDay = (data) => {
    let hours = []
    for (let i = 0; i < 24; i++) hours.push(0);
    for (let i = 0; i < data.length; i++) {
        const log = data[i];
        let d = new Date(log[0])
        hours[d.getHours()-1]++
    }
    return hours
}

const getLogs = () => {
    let s = fs.readdirSync(pathToFolder)
    let all = {}
    s.forEach(e => {
        if (!e.startsWith("connections ")) return
        const data = JSON.parse(fs.readFileSync(path.join(pathToFolder,e)))
        all[e.split(" ")[1].split(".")[0]] = getInteractionsForDay(data)
    })
    return all
}
console.log(getLogs())

module.exports = getLogs