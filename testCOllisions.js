const { getCurrentWeek, allEdt, makeEDT } = require("./edt.js")
const { groupesPers } = require("./EDT/s2/s2.js")
const jours = ["Lundi", " Mardi", "Mercredi", "Jeudi", "Vendredi"]

console.log(groupesPers)
const info = require("fs").readFileSync("./EDT/s2/info.txt", "utf8").toString()
const tableauInfo = []

const nombreToHeure = (n) => {
    if (typeof n != typeof 2) return n
    let reste = n - Math.floor(n)
    if (reste > 0) return Math.floor(n).toString() + "h" + Math.round(reste * 60)
    return Math.floor(n).toString() + "h"
}


const pushIfNotIn = (arr, el) => {
    let val = JSON.stringify(el)
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (JSON.stringify(element) == val) return
    }
    arr.push(el)
}

const isOverlap = (a, b) => {
    if (a[3] == b[3]) return true
    if (a[3] < b[3]) {
        if (a[4] <= b[3]) return false
        else return true
    } else {
        if (b[4] <= a[3]) return false
        else return true
    }
}

const detectOverlap = (arr) => {
    let res = []
    for (let jour = 0; jour < 5; jour++) {
        for (let i = 0; i < arr[jour].length; i++) {
            const element = arr[jour][i];
            for (let j = i + 1; j < arr[jour].length; j++) {
                const element2 = arr[jour][j];
                if (isOverlap(element, element2)) {
                    pushIfNotIn(res, [element, element2, jour])
                }
            }
        }
    }
    return res
}

const resume_prob = (edt) => {
    const res = detectOverlap(edt)
    for (let i = 0; i < res.length; i++) {
        const element = res[i];
        console.log(" - Le " + jours[element[2]] + " entre " + element[0][0] + " [" + nombreToHeure(element[0][3]) + "-" + nombreToHeure(element[0][4]) + "] et " + element[1][0] + " [" + nombreToHeure(element[1][3]) + "-" + nombreToHeure(element[1][4]) +"]")
    }
}


// info.split("\n").forEach(lign => {
//     tableauInfo.push(lign.split(" "))
// })
// console.table(tableauInfo)
// for (let s = 0; s < tableauInfo[0].length; s++) {
    
// }

// let finfo = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

// const recurcif = (n) => {
//     const tn = n==0 ? 1 : n+3
//     if (n == 0) {
//         for (let gi = 1; gi <= 3; gi++) {
//             finfo[tn-1] = gi
//             let edt = makeEDT(tn, 35, gi)[0]
//             if (detectOverlap(edt).length == 0) {
//                 // console.log(finfo)
//                 let res = [0, 0, 0, 0]
//                 for (let g = 0; g < finfo.length; g++) {
//                     const element = finfo[g];
//                     res[element]++
//                 }
//                 if (res.includes(4)) {
//                     let t = res.includes(4)
//                     if (t == 1 && res[2] == 5 && res[3] == 5) {
//                         console.log("groupe info "+gi)
//                         console.log(finfo)
//                     }
//                     if (t == 2 && res[1] == 5 && res[3] == 5) {
//                         console.log("groupe info "+gi+" groupe "+tn)
//                         console.log(finfo)
//                     }
//                     if (t == 3 && res[1] == 5 && res[2] == 5) {
//                         console.log("groupe info "+gi+" groupe "+tn)
//                         console.log(finfo)
//                     }
//                 }
//             }
//         }
//     }else if ([6, 14, 15, 16].includes(tn)) {
//         finfo[tn - 1] = 1
//         recurcif(n - 1)
//         let edt = makeEDT(tn, 35, 1)[0]
//         if (detectOverlap(edt).length != 0) {
//             console.log("HEINNN ????")
//         }
//     }else{
//         for (let gi = 1; gi <= 3; gi++) {
//             finfo[tn-1] = gi
//             let edt = makeEDT(tn, 35, gi)[0]
//             if (detectOverlap(edt).length != 0) {
//                 // console.log("groupe info "+gi+" groupe "+tn)
//                 // resume_prob(edt)
//                 continue
//             }
//             recurcif(n-1)
//         }
//     }
// }
// recurcif(13)




const getC = (k, s) => {
    k = Number(k)
    s = Number(s)
    if (s > 28) { // car les semaines 28 et 29 sont unies donc on traitera la 29 et les suivant comme ayant une semaine de moins
        s -= 1
    }
    s -= 3
    return (32 + k - s - 1) % 16 + 1;
}

const getKfromC = (c, s) => {
    c -= 1
    if (s > 28) { // car les semaines 28 et 29 sont unies donc on traitera la 29 et les suivant comme ayant une semaine de moins
        s -= 1
    }
    s -= 19
    return (32 + c + s) % 16 + 1
}



let p = ""
for (let s = 19; s <= 35; s++) {
    for (let i = 0; i < 16; i++) {
        const aaah = allEdt[s.toString()][i]
        const de = detectOverlap(aaah[0])
        if (de.length > 0) {
            
            p+="Semaine "+s+" Groupe "+(i+1)+" en C"+getC(i+1,s)+" ("+groupesPers[i].join(";")+") : "+de.length+" conflits\n"
            if (aaah[1] != "") {
                p+="Sachant que : "+aaah[1]+"\n"
            }
            for (let n = 0; n < de.length; n++) {
                p += " - Le " + jours[de[n][2]] + " entre " + de[n][0][0] + " [" + nombreToHeure(de[n][0][3]) + "-" + nombreToHeure(de[n][0][4]) + "] et " + de[n][1][0] + " [" + nombreToHeure(de[n][1][3]) + "-" + nombreToHeure(de[n][1][4]) +"]\n"
            }
        }
    }
}
console.log(p)
module.exports = p