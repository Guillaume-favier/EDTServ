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
        if (!log[1].startsWith("/api/v2/classe/") || !log[1].endsWith("/EDT")) continue
        let d = new Date(log[0])
        if (Object.keys(hours).includes(log[5]["pers"])) {
            hours[log[5]["pers"]][d.getHours()]++
        }else{
            hours[log[5]["pers"]] = JSON.parse(JSON.stringify(zéros24))
            hours[log[5]["pers"]][d.getHours()]++
        }
        hours["everyone"][d.getHours()]++
    }
    return hours
}
const getInteractionsForDayOld = (data) => {
    let hours = { "everyone": JSON.parse(JSON.stringify(zéros24)) }
    for (let i = 0; i < data.length; i++) {
        const log = data[i];
        if (log[1] != "/api/v1/all/") continue
        let d = new Date(log[0])
        if (Object.keys(hours).includes(log[5]["name"])) {
            hours[log[5]["name"]][d.getHours()]++
        } else {
            hours[log[5]["name"]] = JSON.parse(JSON.stringify(zéros24))
            hours[log[5]["name"]][d.getHours()]++
        }
        hours["everyone"][d.getHours()]++
    }
    return hours
}
const getLogs = () => {
    let s = fs.readdirSync(pathToFolder)
    let graph = {}
    s.forEach(e => {
        if (!e.startsWith("connections ")) return
        const data = JSON.parse(fs.readFileSync(path.join(pathToFolder,e)))
        graph[e.split(" ")[1].split(".")[0]] = getInteractionsForDay(data)
    })
    let all = { "ok":true, graph, "logToday": JSON.parse(fs.readFileSync(path.join(pathToFolder,s[s.length-3])))}
    console.log(all)
    return all
}

module.exports = getLogs