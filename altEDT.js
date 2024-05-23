const { getCurrentWeek, allEdt } = require("./edt.js")
const { log } = require("./logger.js")



const pushIfNotIn = (arr, el) => {
    let val = JSON.stringify(el)
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (JSON.stringify(element) == val) return
    }
    arr.push(el)
}

const allX = (s,n) => {
    let p = []
    for (let s = 3; s <= 34; s++) {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 5; j++) {
                for (let h = 0; h < allEdt[s.toString()][i][0][j].length; h++) {
                    const c = allEdt[s.toString()][i][0][j][h];
                    if (p.includes(c[n])) continue
                    p.push(c[n])
                }
            }
        }
    }
    return p
}

const allProfs = allX(getCurrentWeek(), 5)
const allClasses = allX(getCurrentWeek(), 2)
log(1, "All the classes and profs were calculated, there is " + allClasses.length + " classes and " + allProfs.length + " profs");

const getEDTX = (s, param, X) => {
    if (s <3 || s > 34) {
        return false
    }
    if (X == 5 && !allProfs.includes(param)) {
        return false
    }
    if (X == 2 && !allClasses.includes(param)) {
        return false
    }
    let p = []
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 5; j++) {
            if (i == 0) p.push([])
            console.log(i,j)
            const pre = allEdt[s.toString()][i]
            console.log(pre)
            const jours = pre[0]
            for (let h = 0; h < jours[j].length; h++) {
                
                const c = jours[j][h];
                if (c[X] == param) pushIfNotIn(p[j], c)
            }
        }
    }

    // sort all the class by time
    for (let i = 0; i < p.length; i++) {
        const element = p[i];
        element.sort((a, b) => {
            return a[3] - b[3]
        })
    }
    return p
}



module.exports = {
    allClasses,
    allProfs,
    getEDTX
}