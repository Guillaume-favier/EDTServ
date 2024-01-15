const { makeEDT, getCurrentWeek } = require("./edt.js")
const allEdt = {}

const getYourWeek = (week) => {
    if (!(allEdt[week])) {
        allEdt[week] = []
        for (let i = 1; i <= 16; i++) {
            allEdt[week].push(makeEDT(i, week))
        }
    }
    return allEdt[week]
}
for (let i = 3; i <= 18; i++) {
    getYourWeek(i)
}


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
    for (let s = 3; s <= 18; s++) {
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 5; j++) {
                // console.log(allEdt)
                for (let h = 0; h < allEdt[s.toString()][i][j].length; h++) {
                    const c = allEdt[s.toString()][i][j][h];
                    // console.log(c,c[n])
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

const getEDTX = (s, param, X) => {
    let p = []
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 5; j++) {
            if (i == 0) p.push([])
            for (let h = 0; h < allEdt[s.toString()][i][j].length; h++) {
                const c = allEdt[s.toString()][i][j][h];
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



// console.log(getEDTProf("Rozsavolgyi"))
// console.log(allProfs)

module.exports = {
    allClasses,
    allProfs,
    getEDTX
}