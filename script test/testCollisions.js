const { allEdt, CpersFromGroup, CallEdt, CsemaineNom, CGroupe } = require("../EDT/edt.js")
const { log } = require("../logger.js");
const jours = ["Lundi", " Mardi", "Mercredi", "Jeudi", "Vendredi"]

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


        log(2," - Le " + jours[element[2]] + " entre " + element[0][0] + " [" + nombreToHeure(element[0][3]) + "-" + nombreToHeure(element[0][4]) + "] et " + element[1][0] + " [" + nombreToHeure(element[1][3]) + "-" + nombreToHeure(element[1][4]) +"]")
    }
}



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
Object.keys(CallEdt).forEach(classe => {
    let pp = ""
    for (let s = 1; s <= CsemaineNom[Object.keys(CsemaineNom)[0]].length; s++) {
        const allPers = Object.keys(CallEdt[classe][s.toString()])
        allPers.forEach(pers => {
            const edtSemaine = CallEdt[classe][s.toString()][pers]
            const de = detectOverlap(edtSemaine[0])
            if (de.length > 0) {
                pp += "Semaine " + s + " Personne " + pers + " (G" + CGroupe[classe][pers] +") : "+de.length+" conflits\n"
                if (edtSemaine[1] != "") {
                    pp+="Sachant que : "+edtSemaine[1]+"\n"
                }
                for (let n = 0; n < de.length; n++) {
                    pp += " - Le " + jours[de[n][2]] + " entre " + de[n][0][0] + " [" + nombreToHeure(de[n][0][3]) + "-" + nombreToHeure(de[n][0][4]) + "] et " + de[n][1][0] + " [" + nombreToHeure(de[n][1][3]) + "-" + nombreToHeure(de[n][1][4]) +"]\n\n"
                }
            }
        })
    }
    if (pp != "") {
        p += "Pour la classe de " + classe + " :\n" + pp
    }
});
if (p!="") {
    log(2,"colisions :\n"+p)
}
module.exports = p