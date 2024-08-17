const fs = require("fs")
const path = require("path")

// récup donnée semestre 1
const { getKholles: getKholles1, makeEDT: makeEDT1, groupesPers: groupesPers1 } = require("./s1/s1.js");
// récup donnée semestre 2
const { getKholles: getKholles2, makeEDT: makeEDT2, groupesPers: groupesPers2 } = require("./s2/s2.js");


const getText = (p) => fs.readFileSync(path.join(__dirname,p), "utf8");
const getJson = (p) => JSON.parse(getText(p));


const groupes = getJson("groupes.json");
const semaineNom = getJson(getJson("configMP2I.json")["semaines"])
jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const ds = getJson("DS.json");

const ajusteDate = (n) => { // génère un string qui assure la présence de 2 chiffre dans une date pour que le format 3/6/2024 -> 03/06/2024
    return n < 10 ? "0" + n : n;
};

const stringToDate = (date) => { // transforme une date en string en un type date à minuit le jour même
    l = date.split("/");
    return new Date(2000 + Number(l[2]), Number(l[1]) - 1, Number(l[0]));
};

const getCurrentWeek = (now = new Date()) => { // sur la base d'une date ou de la date actuelle, donne le numéro de la semaine courrante ou de la dernière si dépassement.
    const décalage = 5 * (24 * 3600 * 1000) + 13 * 3600 * 1000;
    const nowTime = now.getTime();
    let semaine = 0;
    semaineNom.forEach((s, i) => {
        const d = stringToDate(s);
        if (d.getTime() + décalage <= nowTime) semaine = i + 3;
    });
    return semaine;
};

const getNumJours = (semaine) => { // donne les dates des jours scolaire pour une semaine donnée
    // console.log(semaine)
    let n = stringToDate(semaineNom[semaine-1]).getTime();
    const j = [];
    const jj = [];
    for (let i = 0; i < 5; i++) {
        const now = new Date(n);
        jj.push([now.getDate(), now.getMonth() + 1]);
        j.push(jours[i] + " " + ajusteDate(now.getDate()) + "/" + ajusteDate(now.getMonth() + 1));
        n += 24 * 3600 * 1000;
    }
    return [j, jj];
};

const makeEDT = (groupe, semaine, info = null) => {
    if (semaine >= 1 && semaine <= 19) return [makeEDT1(groupe, semaine), ""];
    if (semaine >= 20 && semaine <= 35) return makeEDT2(groupe, semaine, info);
    return null;
};
const getKholles = (groupe, semaine) => {
    if (semaine >= 1 && semaine <= 19) return getKholles1(groupe, semaine);
    if (semaine >= 20 && semaine <= 35) return getKholles2(groupe, semaine)[0];
    return null;
};

module.exports = {
    ds, semaineNom, semaineNom, groupes, getNumJours, makeEDT, getKholles, getCurrentWeek
}