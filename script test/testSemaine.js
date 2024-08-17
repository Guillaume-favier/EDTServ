const fs = require("fs")
const path = require("path")
const semaines = JSON.parse(fs.readFileSync(path.join(__dirname,"EDT/semaine.json"), "utf8"))

const stringToDate = (date) => {
    l = date.split("/")
    return new Date(2000+Number(l[2]), Number(l[1]) - 1, Number(l[0]))
}

const getCurrentWeek = (now = new Date()) => {
    const décalage = 5 * (24 * 3600 * 1000) +13*3600*1000
    const nowTime = now.getTime() 
    console.log(nowTime)
    let semaine = 0
    semaines.forEach((s, i) => {
        const d = stringToDate(s)
        console.log(d, d.getTime(), s, new Date(d.getTime() + décalage))
        if ((d.getTime() + décalage) <= nowTime) {
            semaine = i+3
            console.log("oui")
        }
    })
    return semaine
}

console.log(getCurrentWeek())