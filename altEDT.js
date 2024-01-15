const { makeEDT, getCurrentWeek } = require("./edt.js")
const allEdt = []
for (let i = 0; i < 16; i++) {
    allEdt.push(makeEDT(i + 1, getCurrentWeek()))
}

const pushIfNotIn = (arr, el) => {
    let val = JSON.stringify(el)
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (JSON.stringify(element) == val) return
    }
    arr.push(el)
}

const allX = (n) => {
    let p = []
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 5; j++) {
            for (let h = 0; h < allEdt[i][j].length; h++) {
                const c = allEdt[i][j][h];
                // console.log(c,c[n])
                if (p.includes(c[n])) continue
                p.push(c[n])
            }
        }
    }
    return p
}

const allProfs = allX(5)
const allClasses = allX(2)

const getEDTX = (param, X) => {
    let p = []
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 5; j++) {
            if (i == 0) p.push([])
            for (let h = 0; h < allEdt[i][j].length; h++) {
                const c = allEdt[i][j][h];
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