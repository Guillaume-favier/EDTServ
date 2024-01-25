

const fs = require("fs")
const { log } = require("../../logger.js")
jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]


const getText = (path) => fs.readFileSync(path.substring(1, path.length), "utf8")

const getJson = (path) => JSON.parse(getText(path))

const heureToNombre = (n) => {
    if (typeof n == typeof 2) return n
    if (n.indexOf("h") > -1) {
        let nn = n.split("h")
        return Number(nn[0]) + (Number(nn[1]) / 60)
    } return Number(n)
}

const nombreToHeure = (n) => {
    let reste = n - Math.floor(n)
    if (reste > 0) return Math.floor(n).toString() + "h" + Math.round(reste * 60)
    return Math.floor(n).toString() + "h"
}



const db = getJson("/EDT/s2/kholes.json")            // document qui répertorie les khôlles
const info = getText("/EDT/s2/info.txt")             // document qui répertorie la matrice pour les groupes d'informatique
const orgEDT = getJson("/EDT/s2/EDT.json")           // document qui répertorie les les cours communs pour ceux qui ne font pas SI
const orgEDTsi = getJson("/EDT/s2/EDTsi.json")           // document qui répertorie les les cours communs pour ceux qui font SI
const groupesPers = getJson("/EDT/s2/groupes.json")  // document qui répertorie le nom des memebres de chaques groupes
const hotfix = getJson("/EDT/s2/hotfix.json")        // document qui répertorie les hotfixs
let EDT = clone(orgEDT) // variable qui stocke tout l'EDT
let tableauInfo = []

// Traitement des groupes d'infos dans un tableau
info.split("\n").forEach(lign => {
    tableauInfo.push(lign.split(" "))
})

const majPrem = (s) => s[0].toUpperCase() + s.substring(1)

function clone(a) {
    return JSON.parse(JSON.stringify(a));
}

const trueHeure = (n) => {
    if (typeof n == typeof 2) {
        return n
    }
    return heureToNombre(n)
}


const khollesToEDT = (kh, ma) => {
    // ["Aufranc", 2, 15, "20"] -> ["Khôlle Maths","maths","20",15,16,"Aufranc"]
    // console.log(kh)
    return [
        "Khôlle " + majPrem(ma),
        ma,
        kh[3],
        trueHeure(kh[2]),
        trueHeure(kh[2]) + 1,
        kh[0]
    ]
}

const getC = (k, s) => {
    k = Number(k)
    s = Number(s)
    if (s > 28) { // car les semaines 28 et 29 sont unies donc on traitera la 29 et les suivant comme ayant une semaine de moins
        s -= 1
    }
    s -= 3
    let c = (32 + k - s - 1) % 16 + 1;
    return c
}

// cette fonction rassemble toute les kholles en respectant le règles spécifiques
const getKholes = (k, s) => {
    // console.log(k,s)
    let c = getC(k, s)

    let all = []
    for (let i = 0; i < 5; i++) {
        all.push([])
    }
    if (s<= 24 && k == 2 || k == 3) {
        if (c == 4) {
            const maths = db["maths"][12 - 1]
            all[maths[1] - 1].push(khollesToEDT(maths, "maths"))
        }else{
            const maths = db["maths"][c - 1]
            all[maths[1] - 1].push(khollesToEDT(maths, "maths"))
        }

        if (c == 2) {
            const anglais = db["anglais"][6 - 1]
            all[anglais[1] - 1].push(khollesToEDT(anglais, "anglais"))
        }else if (c%2 == 0) {
            const anglais = db["anglais"][c - 1]
            all[anglais[1] - 1].push(khollesToEDT(anglais, "anglais"))
        }
        if(c == 9) {
            const physique = db["physique"][c - 1]
            all[physique[1] - 1].push(khollesToEDT(physique, "physique"))
        } else if (c % 2 == 1) {
            const physique = db["physique"][11 - 1]
            all[physique[1] - 1].push(khollesToEDT(physique, "physique"))
        }
    }else {
        const maths = db["maths"][c - 1]
        all[maths[1] - 1].push(khollesToEDT(maths, "maths"))
        if (c % 2 == 1) {
            const physique = db["physique"][c - 1]
            all[physique[1] - 1].push(khollesToEDT(physique, "physique"))
        } else {
            const anglais = db["anglais"][c - 1]
            all[anglais[1] - 1].push(khollesToEDT(anglais, "anglais"))
        }
    }
    
    if (c == 1 || c == 10) {

        const info = db["info"][c - 1]
        all[info[1] - 1].push(khollesToEDT(info, "info"))
    }
    if ((s % 2 == 0 && (c == 9 || c == 14))) {

        const francais = db["francais"][c - 1]
        all[francais[1] - 1].push(khollesToEDT(francais, "français"))
    }
    return all
}


const testparams = () => {
    return groupeK != 0
}


const makeEDT = (k, semaine) => {
    groupeI = tableauInfo[k - 1][semaine - 16 - 3]
    const semaineC = getC(k, semaine) // kholes[semaine - 3]
    EDT = []
    EDT = (k == 2 || k == 3) ? clone(orgEDTsi) : clone(orgEDT)
    kholes = []
    for (let i = 0; i < 16; i++) {
        kholes.push([])
    }
    let mettreSemaine = [[], [], [], [], []]
    // on ajoute sans ordre précis les cours kholles et TD à ajouter à l'EDT pour on les remmettra bien dans l'EDT plus tard
    const n1 = () => {
        
        mettreSemaine[0].push(["Anglais", "anglais", "33", 13, 14, "Bocquillon"])
        mettreSemaine[0].push(["TD Physique", "physique", "20", 14, 16, "Bouchet"])
        mettreSemaine[4].push(["TD Maths", "maths", "20", heureToNombre("7h50"), heureToNombre("9h50"), "Aufranc"])
        mettreSemaine[4].push(["TP Physique", "physique", "Labo de physique", heureToNombre("9h50"), heureToNombre("11h50"), "Bouchet"])
    }

    const n2 = () => {
        mettreSemaine[0].push(["Anglais", "anglais", "33", 14, 15, "Bocquillon"])
        mettreSemaine[0].push(["TD Physique", "physique", "20", 12, 14, "Bouchet"])
        mettreSemaine[4].push(["TD Maths", "maths", "20", heureToNombre("9h50"), heureToNombre("11h50"), "Aufranc"])
        mettreSemaine[4].push(["TP Physique", "physique", "Labo de physique", heureToNombre("7h50"), heureToNombre("9h50"), "Bouchet"])
    }
    
    
    if (semaine % 2 == 1) {
        if (k % 2 == 1) {
            n1()
        } else {
            n2()
        }
    } else {
        if (k % 2 == 1) {
            n2()
        } else {
            n1()
        }
    }

    // Groupes d'info 
    if (groupeI == 1) {
        mettreSemaine[3].push(["TP Info", "info", "37", 11, 13, "Rozsavolgyi"])
    } if (groupeI == 2) {
        mettreSemaine[3].push(["TP Info", "info", "37", 14, 16, "Rozsavolgyi"])
    } if (groupeI == 3) {
        mettreSemaine[3].push(["TP Info", "info", "26", 16, 18, "Rozsavolgyi"])
    }


    // goupes de LV2
    if ([1, 6, 14, 15, 16].includes(k)) {
        mettreSemaine[3].push(["LV2", "lv2", "🤷‍♂️", 17, 19, "LV2"])
    }

    // ajout de tout les cours dans l'EDT au bon endroit
    for (let jourDeSemaine = 0; jourDeSemaine < 5; jourDeSemaine++) {
        mettreSemaine[jourDeSemaine].forEach(cou => {
            let bon = false;
            EDT[jourDeSemaine].forEach((e, i) => {
                if (bon) return
                if (e[3] > cou[3]) {
                    EDT[jourDeSemaine].splice(i, 0, cou);
                    bon = true
                }
            });
            if (bon == false) {
                EDT[jourDeSemaine].push(cou)
            }
        })
    }

    // ajout de toutes les kholles dans l'EDT
    const matiere = getKholes(k, semaine);
    // console.log(matiere)
    for (let jour = 0; jour < matiere.length; jour++) {
        matiere[jour].forEach(kh => {
            let bon = false;
            EDT[jour].forEach((e, i) => {
                if (bon) return
                if (e[3] > Math.round(heureToNombre(kh[3]))) {
                    EDT[jour].splice(i, 0, kh);
                    bon = true
                }
            })
            if (bon == false) {
                EDT[jour].push(kh)
            }
        });
    }

    // hot fix:
    Object.keys(hotfix).forEach(jourId => {
        const s = jourId.split("/")
        if (Number(s[0]) == semaine) {
            // log(0, "Semaine de HOTFIX ! jour : " + jours[s[1]-1])
            let done = false
            for (let i = 0; i < hotfix[jourId].length && !done; i++) {
                const poss = hotfix[jourId][i];
                if (poss[0] == "e") {
                    // log(0, "validée : tout le monde !")
                    EDT[s[1]] = poss[1]
                    done = true
                }
                if (poss[0] == "p" && k % 2 == 0) {
                    // log(0, "validée : groupe pair")
                    EDT[s[1]] = poss[1]
                    done = true
                } else if (poss[0] == "i" && k % 2 == 1) {
                    // log(0, "validée : groupe impair")
                    EDT[s[1]] = poss[1]
                    done = true
                } else if (Number(poss[0]) == k) {
                    // log(0, "validée : groupe " + k)
                    EDT[s[1]] = poss[1]
                    done = true
                }
            }
        }
    })
    return EDT
}
module.exports = {
    getKholes,
    makeEDT,
    groupesPers
}