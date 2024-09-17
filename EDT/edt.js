const fs = require("fs");
const path = require("path")
const { log } = require("../logger.js");
jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const getText = (p) => fs.readFileSync(path.join(__dirname, p), "utf8");
const getJson = (p) => JSON.parse(getText(p));

const NomEtGoupeToGoupeEtNom = (groupes) => {
    let res = []

    const firstPers = Object.keys(groupes)[0] // personne lambda de la liste permettant d'évaluer le nombre de classifications

    // i représente la classification, le numéro du système de groupe ex 0 : 1semèstre ; 1 : 2ème etc ... car une même personne peut changer de groupe durant l'année 
    for (let i = 0; i < groupes[firstPers].length; i++) {
        res.push([])

        let locmax = 0;
        Object.keys(groupes).forEach(nom => {
            if (groupes[nom][i] > locmax) locmax = groupes[nom][i]
        });

        // g représente un numéro de groupe
        // ici on cherche à regrouper les personnes d'un même groupe
        for (let g = 0; g <= locmax; g++) res[i].push([])
        Object.keys(groupes).forEach(nom => {
            res[i][ groupes[nom][i] ].push(nom)
        });
    }
    return res
}


const config = getJson("./config.json")

const classes = Object.keys(config);
const CallEdt = {};

const CGroupe = {}
const Cnoms = {}
const Cds = {}
const CsemaineNom = {}

const CgetNumJours = {}
const CgetKholles = {}
const CgetCurrentWeek = {}
const CpersFromGroup = {}



classes.forEach(classe => {
    const classeConfig = getJson("./"+config[classe])
    const { ds, semaineNom, groupes, getNumJours, makeEDT, getKholles, getCurrentWeek } = require(path.join(__dirname, classeConfig["path"],classeConfig["main"]))
    
    let preAllEdt = {}
    const getYourWeek = (week) => { // récupère tout les cours de la semaine pour tout les groupes et le rajoute à la var allEdt
        const sweek = week.toString();
        if (!preAllEdt[sweek]) {
            preAllEdt[sweek] = {};
            Object.keys(groupes).forEach( pers => {
                preAllEdt[sweek][pers] = makeEDT(pers, week);
            })
        }
        return preAllEdt[sweek];
    };

    // exécute getYouWeek pour toutes les semaines pour remplir preAllEdt
    for (let i = 1; i <= semaineNom.length; i++) {
        getYourWeek(i);
    }

    CallEdt[classe] = preAllEdt

    Cds[classe] = ds
    CGroupe[classe] = groupes
    Cnoms[classe] = Object.keys(CGroupe[classe])
    CsemaineNom[classe] = semaineNom
    CgetNumJours[classe] = getNumJours
    CgetKholles[classe] = getKholles
    CgetCurrentWeek[classe] = getCurrentWeek

    CpersFromGroup[classe] = NomEtGoupeToGoupeEtNom(groupes)
});

log(1, "All the weeks were loaded");



const regroupeInfo = (classe, nom, s) => {
    const k = CGroupe[classe][nom][s < 19 ? 0 : 1];
    const days = CgetNumJours[classe](s);
    let res = {
        ok: true,
        days: days[1],
        fullDays: days[0],
        EDT: CallEdt[classe][s.toString()][nom][0],
        kholles: CgetKholles[classe](k, s, nom),
        membres: CpersFromGroup[classe][0][k],
        DS: Cds[classe][s - 1],
        message: CallEdt[classe][s.toString()][nom][1],
    };
    return res;
};
const base = (classe) => {
    return {
        weeks: CsemaineNom[classe],
        noms: Cnoms[classe],
        currentWeek: CgetCurrentWeek[classe](),
    };
};

module.exports = {
    regroupeInfo,
    CgetNumJours,
    base,
    CgetCurrentWeek,
    CallEdt,
    Cnoms,
    "noms":Object.keys(Cnoms).map(classe => Cnoms[classe]),
    CpersFromGroup,
    CsemaineNom,
    CgetCurrentWeek,
    CGroupe,
    "Classes":Object.keys(CallEdt)
};
