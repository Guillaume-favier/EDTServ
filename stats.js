const fs = require("fs")
const path = require("path")
const pathToFolder = path.join(__dirname, "logs")
let tmp = []
for (let i = 0; i < 24; i++) tmp.push(0);
const zéros24 = JSON.parse(JSON.stringify(tmp))


const getInteractionsForDay = (data) => {
    let hours = { "everyone": JSON.parse(JSON.stringify(zéros24)) }
    for (let i = 0; i < data.length; i++) {
        const log = data[i];
        if (log[1] != "/api/v1/all/") continue
        let d = new Date(log[0])
        // console.log(log[5]["name"]);
        if (Object.keys(hours).includes(log[5]["name"])) {
            hours[log[5]["name"]][d.getHours()]++
        }else{
            hours[log[5]["name"]] = JSON.parse(JSON.stringify(zéros24))
            hours[log[5]["name"]][d.getHours()]++
        }
        hours["everyone"][d.getHours()]++
        // console.log(log)
    }
    return hours
}

const getLogs = () => {
    let s = fs.readdirSync(pathToFolder)
    let all = {}
    s.forEach(e => {
        if (!e.startsWith("connections ")) return
        const data = JSON.parse(fs.readFileSync(path.join(pathToFolder,e)))
        // console.log(data)
        all[e.split(" ")[1].split(".")[0]] = getInteractionsForDay(data)
    })
    return all
}
// console.log(getLogs())

module.exports = getLogs