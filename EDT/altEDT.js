const { CallEdt, CsemaineNom } = require("./edt.js")
const { log } = require("../logger.js")



const pushIfNotIn = (arr, el) => { // algo horrible qui push un élément dans la liste si il n'y est pas déjà
    let val = JSON.stringify(el)
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (JSON.stringify(element) == val) return
    }
    arr.push(el)
}

const allX = (n) => { // récupère toutes les possibilités de 1 paramètre (n) parmis ceux du format parmis tout les cours de toute l'année exemple 
    let p = [] 
    Object.keys(CallEdt).forEach(classe => {
        for (let s = 1; s <= CsemaineNom[Object.keys(CsemaineNom)[0]].length; s++) { // pour toutes les semaines
            let temp = CallEdt[classe][s.toString()]
            const toutNoms = Object.keys(temp)
            toutNoms.forEach(nom => { // pour tout les groupes
                for (let j = 0; j < 5; j++) { // pour tout les jours de la semaine scolaire
                    // console.log(CallEdt[classe][s.toString()],classe, s)
                    //console.log(CallEdt[classe][s.toString()], nom)
                    for (let h = 0; h < CallEdt[classe][s.toString()][nom][0][j].length; h++) { // pour tout les cours de la journée
                        const c = CallEdt[classe][s.toString()][nom][0][j][h];
                        if (p.includes(c[n])) continue
                        p.push(c[n])
                    }
                }
            })
        }
    })
    return p
}

const allProfs = allX(5) // récupère tout les profs possible
const allSalles = allX(2) // récupère toutes les salles possible

log(1, "All the classes and profs were calculated, there is " + allSalles.length + " classes and " + allProfs.length + " profs");

const getEDTX = (s, param, X) => {
    /* 
        Récupère tout les cours pour une semaine donnée (s) et un paramètre de condition (n), 
        Par exemple chercher tout les cours de la semaine 12 et en salle 20 donne : getEDTX(12, 20, 2) car 2 est la paramètre de la salle
        Un autre exemple : chercher tout les cours de la semaine 16 donné par Aufranc donne : getEDTX(12, "Aufranc", 5) car 5 est la paramètre du prof
    */

    if (X == 5 && !allProfs.includes(param)) return false // si on cherche pour un prof donné, on vérifie que ce prof existe
    if (X == 2 && !allSalles.includes(param)) return false // idem pour les salles
    let out = []
    Object.keys(CallEdt).forEach(classe => {
        let once = true
        Object.keys(CallEdt[classe][s.toString()]).forEach(pers => {
            for (let j = 0; j < 5; j++) { //pour tout les jours de la semaine scolaire
                if (once) out.push([]) // on rajoute un tableau pour chaque jour
                const jours = CallEdt[classe][s.toString()][pers][0]
                for (let h = 0; h < jours[j].length; h++) {
                    const c = jours[j][h];
                    if (c[X] == param) {
                        console.log(out)
                        pushIfNotIn(out[j], c)
                    }
                }
            }
            once = false
        })
    })

    // On trie la liste en fonction du temps
    for (let i = 0; i < out.length; i++) {
        const element = out[i];
        element.sort((a, b) => {
            return a[3] - b[3]
        })
    }
    return out
}



module.exports = {
    allSalles,
    allProfs,
    getEDTX
}