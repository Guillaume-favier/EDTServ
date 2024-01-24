const fs = require("fs")
const { log } = require("./logger.js")
const { getKholes, makeEDT, groupesPers, ds } = require("./EDT/s1/s1.js")
const semaineNom = (fs.readFileSync("./EDT/semaine.txt", "utf8")).split("\n")
jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]

const ajusteDate = (n) => {
    return n < 10 ? "0" + n : n
}

const stringToDate = (date) => {
	l = date.split("/")
	return new Date(2000 + Number(l[2]), Number(l[1]) - 1, Number(l[0]))
}

const getCurrentWeek = (now = new Date()) => {
	const décalage = 5 * (24 * 3600 * 1000) + 13 * 3600 * 1000
	const nowTime = now.getTime()
	//console.log(nowTime)
	let semaine = 0
	semaineNom.forEach((s, i) => {
		const d = stringToDate(s)
		// console.log(d, d.getTime(), s, new Date(d.getTime() + décalage))
		if ((d.getTime() + décalage) <= nowTime) semaine = i+3
	})
	return semaine
}

const getNumJours = (semaine) => {
	let n = stringToDate(semaineNom[semaine - 2]).getTime()
	const j = [];
	const jj = [];
	for (let i = 0; i < 5; i++) {
		const now = new Date(n)
		jj.push([now.getDate(), now.getMonth() + 1])
		j.push(jours[i] + " " + ajusteDate(now.getDate()) + "/" + ajusteDate(now.getMonth() + 1))
		n += 24 * 3600 * 1000
	}
	return [j,jj]
}

const majPrem = (s) => s[0].toUpperCase() + s.substring(1)





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
log(1, "All the weeks were loaded");
const regroupeInfo = (k, s) => {
	const days = getNumJours(s);
	let res = {
		"ok":true,
		"days": days[1],
		"fullDays": days[0],
		"EDT": allEdt[s.toString()][k - 1],
		"kholles": getKholes(k, s),
		"membres": groupesPers[k - 1],
		"DS": ds[s-2],
		"message": ""
	}
	return res
}

const base = () => {
	return {
		"weeks": semaineNom,
		"groupes": groupesPers,
		"currentWeek": getCurrentWeek()
	}
}



module.exports = {
	regroupeInfo,
	makeEDT,
	getNumJours,
	base,
	getCurrentWeek,
	allEdt
}